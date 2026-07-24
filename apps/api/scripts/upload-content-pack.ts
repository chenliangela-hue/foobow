// Uploads the pre-generated interaction content pack to the public-assets
// Supabase Storage bucket, where the app reads it over CDN.
//
// Why: AI-authored content is generated ONCE (offline, here) and reused by
// every user forever, so runtime AI token spend is zero. Extending the pack
// is a content change — no code deploy, no per-request model calls.
//
// Usage: npm --prefix apps/api run content:upload

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const PACK_FILE = "content/blessing-pack.v1.json";
const BUCKET = "public-assets";
const OBJECT_KEY = "content/blessing-pack.v1.json";

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

async function main(): Promise<void> {
  loadRootEnvLocal();

  const supabaseUrl = (process.env.SUPABASE_URL ?? "").replace(/\/$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.log("Content pack upload skipped: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing.");
    return;
  }

  const body = readFileSync(resolve(import.meta.dirname, "../../../", PACK_FILE), "utf8");
  // Validate before publishing — a broken pack would degrade the UI.
  const parsed = JSON.parse(body) as { locales: string[]; deedReflections: Record<string, string[]> };
  if (!Array.isArray(parsed.locales) || parsed.locales.length === 0) {
    throw new Error("Content pack has no locales.");
  }
  for (const locale of parsed.locales) {
    if (!parsed.deedReflections[locale]?.length) {
      throw new Error(`Content pack missing deedReflections for ${locale}`);
    }
  }

  const response = await fetch(`${supabaseUrl}/storage/v1/object/${BUCKET}/${OBJECT_KEY}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
      "Content-Type": "application/json",
      "cache-control": "public, max-age=3600",
      "x-upsert": "true"
    },
    body
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status} ${await response.text()}`);
  }

  console.log(`Uploaded ${PACK_FILE} -> ${BUCKET}/${OBJECT_KEY}`);
  console.log(`Public URL: ${supabaseUrl}/storage/v1/object/public/${BUCKET}/${OBJECT_KEY}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
