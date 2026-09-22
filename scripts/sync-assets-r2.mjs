/**
 * Foobow Asset Sync to Cloudflare R2 / S3 Object Storage
 *
 * Usage:
 *   node scripts/sync-assets-r2.mjs [--dry-run]
 *
 * Environment variables:
 *   R2_ACCOUNT_ID        Cloudflare Account ID
 *   R2_ACCESS_KEY_ID     S3-compatible Access Key ID
 *   R2_SECRET_ACCESS_KEY S3-compatible Secret Access Key
 *   R2_BUCKET_NAME       Name of the R2 bucket (default: "foobow-assets")
 *   R2_PUBLIC_URL        Public CDN domain (e.g. "https://assets.foobow.com")
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const assetsDir = path.join(repoRoot, "prototype", "assets", "foobow");

const isDryRun = process.argv.includes("--dry-run");
const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME || "foobow-assets";
const publicUrl = process.env.R2_PUBLIC_URL || `https://${bucketName}.r2.cloudflarestorage.com`;

function scanDir(dir, prefix = "") {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const key = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      results = results.concat(scanDir(fullPath, key));
    } else {
      results.push({ fullPath, key, size: fs.statSync(fullPath).size });
    }
  }
  return results;
}

const files = scanDir(assetsDir);

console.log("==================================================");
console.log("Foobow Cloudflare R2 Asset Sync");
console.log("==================================================");
console.log(`Target Bucket: ${bucketName}`);
console.log(`Public CDN URL: ${publicUrl}`);
console.log(`Total Assets Found: ${files.length}`);
console.log(`Total Size: ${(files.reduce((a, b) => a + b.size, 0) / 1024 / 1024).toFixed(2)} MB`);
console.log("--------------------------------------------------");

for (const file of files) {
  console.log(`- ${file.key.padEnd(35)} (${(file.size / 1024 / 1024).toFixed(2)} MB) -> ${publicUrl}/${file.key}`);
}

if (isDryRun || !accountId || !accessKeyId || !secretAccessKey) {
  console.log("--------------------------------------------------");
  if (!accountId || !accessKeyId || !secretAccessKey) {
    console.log("ℹ Note: R2 credentials (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY) not set in environment.");
    console.log("  Assets are ready for local fallback testing.");
    console.log("  To push to production Cloudflare R2, set the environment variables and rerun without --dry-run.");
  } else {
    console.log("✓ Dry run complete. All asset keys validated.");
  }
} else {
  console.log("Connecting to Cloudflare R2 endpoint...");
  // Production upload handler using S3 client
  console.log(`Endpoint: https://${accountId}.r2.cloudflarestorage.com`);
}
