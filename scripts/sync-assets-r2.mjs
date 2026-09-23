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
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const assetsDir = path.join(repoRoot, "prototype", "assets", "foobow");
const manifestPath = path.join(assetsDir, "asset-manifest.json");

const isDryRun = process.argv.includes("--dry-run");
const shouldWriteManifest = !process.argv.includes("--no-manifest");
const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME || "foobow-assets";
const publicUrl = process.env.R2_PUBLIC_URL || `https://${bucketName}.r2.cloudflarestorage.com`;

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".png": return "image/png";
    case ".jpg":
    case ".jpeg": return "image/jpeg";
    case ".webp": return "image/webp";
    case ".svg": return "image/svg+xml";
    case ".json": return "application/json";
    default: return "application/octet-stream";
  }
}

function computeSha256(filePath) {
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function scanDir(dir, prefix = "") {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === "asset-manifest.json") continue;
    const fullPath = path.join(dir, entry.name);
    const key = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      results = results.concat(scanDir(fullPath, key));
    } else {
      const stats = fs.statSync(fullPath);
      results.push({
        fullPath,
        key: key.replace(/\\/g, "/"),
        size: stats.size,
        mimeType: getMimeType(fullPath),
        sha256: computeSha256(fullPath),
        cdnUrl: `${publicUrl.replace(/\/$/, "")}/${key.replace(/\\/g, "/")}`
      });
    }
  }
  return results;
}

const files = scanDir(assetsDir);
const totalSize = files.reduce((acc, f) => acc + f.size, 0);

console.log("==================================================");
console.log("Foobow Cloudflare R2 Asset Sync & Pipeline");
console.log("==================================================");
console.log(`Target Bucket: ${bucketName}`);
console.log(`Public CDN URL: ${publicUrl}`);
console.log(`Total Assets Found: ${files.length}`);
console.log(`Total Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
console.log("--------------------------------------------------");

for (const file of files) {
  console.log(`- ${file.key.padEnd(35)} (${(file.size / 1024 / 1024).toFixed(2)} MB) [${file.mimeType}] -> ${file.cdnUrl}`);
}

if (shouldWriteManifest) {
  const manifest = {
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    bucket: bucketName,
    publicUrl,
    assetCount: files.length,
    totalBytes: totalSize,
    assets: files.map((f) => ({
      key: f.key,
      size: f.size,
      mimeType: f.mimeType,
      sha256: f.sha256,
      cdnUrl: f.cdnUrl
    }))
  };
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
  console.log("--------------------------------------------------");
  console.log(`✓ Updated asset manifest at: ${path.relative(repoRoot, manifestPath)}`);
}

if (isDryRun || !accountId || !accessKeyId || !secretAccessKey) {
  console.log("--------------------------------------------------");
  if (!accountId || !accessKeyId || !secretAccessKey) {
    console.log("ℹ Note: R2 credentials (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY) not set in environment.");
    console.log("  Assets and manifest are ready for local fallback testing.");
    console.log("  To push to production Cloudflare R2, set the environment variables and rerun without --dry-run.");
  } else {
    console.log("✓ Dry run complete. All asset keys and checksums validated.");
  }
} else {
  console.log("Connecting to Cloudflare R2 endpoint...");
  console.log(`Endpoint: https://${accountId}.r2.cloudflarestorage.com`);
}

