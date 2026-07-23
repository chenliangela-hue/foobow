// Applies the versioned SQL schema and reference seed data to the Supabase
// project described in the root .env.local. Idempotent: skips migrations
// whose lead table already exists. Connects through the region's IPv4
// session pooler because Supabase direct DB hosts are IPv6-only.
//
// Usage: npm --prefix apps/api run db:supabase-provision

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Client } from "pg";

function loadRootEnvLocal(): void {
  try {
    const raw = readFileSync(resolve(import.meta.dirname, "../../../.env.local"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const match = /^([A-Z0-9_]+)=["“]?(.*?)["”]?$/.exec(line.trim());
      if (match && !(match[1] in process.env)) {
        process.env[match[1]] = match[2];
      }
    }
  } catch {
    // Rely on ambient environment.
  }
}

const steps: { file: string; guardTable: string | null }[] = [
  { file: "database/migrations/0001_initial.sql", guardTable: "users" },
  { file: "database/migrations/0002_focus_sessions.sql", guardTable: "focus_sessions" },
  { file: "database/seeds/0001_reference_data.sql", guardTable: null }
];

async function main(): Promise<void> {
  loadRootEnvLocal();

  const password = process.env.SUPABASE_DB_PASSWORD;
  const projectRef = /https:\/\/([a-z0-9]+)\.supabase\.co/.exec(process.env.SUPABASE_URL ?? "")?.[1];
  const region = process.env.SUPABASE_REGION;
  if (!password || !projectRef || !region) {
    console.log("Supabase provision skipped: SUPABASE_DB_PASSWORD, SUPABASE_URL, or SUPABASE_REGION missing.");
    return;
  }

  const client = new Client({
    host: `aws-1-${region}.pooler.supabase.com`,
    port: 5432,
    user: `postgres.${projectRef}`,
    password,
    database: "postgres",
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();

  try {
    for (const step of steps) {
      if (step.guardTable) {
        const existing = await client.query(
          "select 1 from information_schema.tables where table_schema = 'public' and table_name = $1",
          [step.guardTable]
        );
        if ((existing.rowCount ?? 0) > 0) {
          console.log(`skip ${step.file} (table ${step.guardTable} already exists)`);
          continue;
        }
      }
      const sql = readFileSync(resolve(import.meta.dirname, "../../../", step.file), "utf8");
      await client.query(sql);
      console.log(`applied ${step.file}`);
    }

    const summary = await client.query(
      "select (select count(*) from deed_types) as deed_types, (select count(*) from map_spots) as map_spots, (select count(*) from donation_campaigns) as campaigns"
    );
    console.log(`Supabase ready: ${JSON.stringify(summary.rows[0])}`);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
