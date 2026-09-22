import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const srcDir = path.join(repoRoot, "shared", "sample-background-light");
const dstDir = path.join(repoRoot, "prototype", "assets", "foobow", "backgrounds");

const fileMap = [
  { src: "ChatGPT Image Sep 21, 2026, 10_57_33 PM (1).png", dst: "landing-light.png" },
  { src: "ChatGPT Image Sep 21, 2026, 10_57_34 PM (3).png", dst: "tab-today-light.png" },
  { src: "ChatGPT Image Sep 21, 2026, 10_57_34 PM (2).png", dst: "tab-deeds-light.png" },
  { src: "ChatGPT Image Sep 21, 2026, 10_57_35 PM (5).png", dst: "tab-blessings-light.png" },
  { src: "ChatGPT Image Sep 21, 2026, 10_57_34 PM (4).png", dst: "tab-map-light.png" },
  { src: "ChatGPT Image Sep 21, 2026, 10_57_35 PM (6).png", dst: "tab-community-light.png" },
  { src: "ChatGPT Image Sep 21, 2026, 10_57_35 PM (7).png", dst: "tab-profile-light.png" }
];

console.log("Copying curated light-mode backgrounds...");
for (const { src, dst } of fileMap) {
  const srcPath = path.join(srcDir, src);
  const dstPath = path.join(dstDir, dst);
  if (!fs.existsSync(srcPath)) {
    console.error(`Missing source file: ${srcPath}`);
    process.exit(1);
  }
  fs.copyFileSync(srcPath, dstPath);
  const stat = fs.statSync(dstPath);
  console.log(`✓ Copied ${src} -> ${dst} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
}
console.log("All 7 curated light-mode backgrounds installed successfully.");
