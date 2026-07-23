// Creates the Supabase Storage buckets Foobow uses for media. Binaries live
// here — never in Postgres; the `media_assets` table only stores pointers.
// Idempotent: existing buckets are left untouched.
//
//   public-assets  public CDN   curated animations, location views, art
//   user-uploads   private      user photos (served via signed URLs)
//   ai-generated   private      AI images (promoted to public on approval)
//
// Usage: npm --prefix apps/api run db:supabase-storage

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

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

const IMAGE_MOTION_AUDIO = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/json",
  "video/mp4",
  "video/webm",
  "audio/mpeg",
  "audio/ogg"
];

const buckets = [
  { id: "public-assets", public: true, fileSizeLimit: 26214400, allowedMimeTypes: IMAGE_MOTION_AUDIO },
  { id: "user-uploads", public: false, fileSizeLimit: 10485760, allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"] },
  { id: "ai-generated", public: false, fileSizeLimit: 10485760, allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"] }
];

async function main(): Promise<void> {
  loadRootEnvLocal();

  const supabaseUrl = (process.env.SUPABASE_URL ?? "").replace(/\/$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.log("Supabase storage provision skipped: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing.");
    return;
  }

  const headers = {
    Authorization: `Bearer ${serviceKey}`,
    apikey: serviceKey,
    "Content-Type": "application/json"
  };

  const listResponse = await fetch(`${supabaseUrl}/storage/v1/bucket`, { headers });
  if (!listResponse.ok) {
    throw new Error(`Listing buckets failed: ${listResponse.status} ${await listResponse.text()}`);
  }
  const existing = new Set(((await listResponse.json()) as { name: string }[]).map((b) => b.name));

  for (const bucket of buckets) {
    if (existing.has(bucket.id)) {
      console.log(`skip ${bucket.id} (already exists)`);
      continue;
    }
    const response = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        id: bucket.id,
        name: bucket.id,
        public: bucket.public,
        file_size_limit: bucket.fileSizeLimit,
        allowed_mime_types: bucket.allowedMimeTypes
      })
    });
    if (!response.ok) {
      throw new Error(`Creating bucket ${bucket.id} failed: ${response.status} ${await response.text()}`);
    }
    console.log(`created ${bucket.id} (${bucket.public ? "public" : "private"})`);
  }

  console.log("Supabase storage buckets are ready.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
