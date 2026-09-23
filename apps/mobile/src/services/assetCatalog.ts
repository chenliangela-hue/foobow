/**
 * Foobow Mobile Asset Catalog & Offline Bundle Manifest
 * Provides type-safe access to all 30 pre-bundled Zen sanctuary assets,
 * Cloudflare R2 CDN resolution, and graceful offline fallback.
 */

export const R2_PUBLIC_BASE_URL =
  process.env.EXPO_PUBLIC_ASSETS_CDN_URL || "https://foobow-assets.r2.cloudflarestorage.com";

export type FoobowAssetKey =
  | "backgrounds/hero-night-lake.png"
  | "backgrounds/landing-light.png"
  | "backgrounds/mobile-sanctuary.png"
  | "backgrounds/mountain-moon.png"
  | "backgrounds/ritual-lake.png"
  | "backgrounds/sanctuary-lake.png"
  | "backgrounds/tab-blessings-dark.png"
  | "backgrounds/tab-blessings-light.png"
  | "backgrounds/tab-blessings.png"
  | "backgrounds/tab-community-dark.png"
  | "backgrounds/tab-community-light.png"
  | "backgrounds/tab-community.png"
  | "backgrounds/tab-deeds-dark.png"
  | "backgrounds/tab-deeds-light.png"
  | "backgrounds/tab-deeds.png"
  | "backgrounds/tab-map-dark.png"
  | "backgrounds/tab-map-light.png"
  | "backgrounds/tab-map.png"
  | "backgrounds/tab-profile-dark.png"
  | "backgrounds/tab-profile-light.png"
  | "backgrounds/tab-profile.png"
  | "backgrounds/tab-today-dark.png"
  | "backgrounds/tab-today-light.png"
  | "backgrounds/tab-today.png"
  | "backgrounds/world-map-bg.png"
  | "logo/foobow-logo.png"
  | "logo/lotus-logo.png"
  | "objects/earth-globe-3d.png"
  | "objects/earth-globe.png"
  | "objects/lotus-glow.png";

export interface AssetDescriptor {
  key: FoobowAssetKey;
  category: "backgrounds" | "logo" | "objects";
  mimeType: "image/png";
  cdnUrl: string;
}

export const ASSET_CATALOG: Record<FoobowAssetKey, AssetDescriptor> = {
  "backgrounds/hero-night-lake.png": {
    key: "backgrounds/hero-night-lake.png",
    category: "backgrounds",
    mimeType: "image/png",
    cdnUrl: `${R2_PUBLIC_BASE_URL}/backgrounds/hero-night-lake.png`
  },
  "backgrounds/landing-light.png": {
    key: "backgrounds/landing-light.png",
    category: "backgrounds",
    mimeType: "image/png",
    cdnUrl: `${R2_PUBLIC_BASE_URL}/backgrounds/landing-light.png`
  },
  "backgrounds/mobile-sanctuary.png": {
    key: "backgrounds/mobile-sanctuary.png",
    category: "backgrounds",
    mimeType: "image/png",
    cdnUrl: `${R2_PUBLIC_BASE_URL}/backgrounds/mobile-sanctuary.png`
  },
  "backgrounds/mountain-moon.png": {
    key: "backgrounds/mountain-moon.png",
    category: "backgrounds",
    mimeType: "image/png",
    cdnUrl: `${R2_PUBLIC_BASE_URL}/backgrounds/mountain-moon.png`
  },
  "backgrounds/ritual-lake.png": {
    key: "backgrounds/ritual-lake.png",
    category: "backgrounds",
    mimeType: "image/png",
    cdnUrl: `${R2_PUBLIC_BASE_URL}/backgrounds/ritual-lake.png`
  },
  "backgrounds/sanctuary-lake.png": {
    key: "backgrounds/sanctuary-lake.png",
    category: "backgrounds",
    mimeType: "image/png",
    cdnUrl: `${R2_PUBLIC_BASE_URL}/backgrounds/sanctuary-lake.png`
  },
  "backgrounds/tab-blessings-dark.png": {
    key: "backgrounds/tab-blessings-dark.png",
    category: "backgrounds",
    mimeType: "image/png",
    cdnUrl: `${R2_PUBLIC_BASE_URL}/backgrounds/tab-blessings-dark.png`
  },
  "backgrounds/tab-blessings-light.png": {
    key: "backgrounds/tab-blessings-light.png",
    category: "backgrounds",
    mimeType: "image/png",
    cdnUrl: `${R2_PUBLIC_BASE_URL}/backgrounds/tab-blessings-light.png`
  },
  "backgrounds/tab-blessings.png": {
    key: "backgrounds/tab-blessings.png",
    category: "backgrounds",
    mimeType: "image/png",
    cdnUrl: `${R2_PUBLIC_BASE_URL}/backgrounds/tab-blessings.png`
  },
  "backgrounds/tab-community-dark.png": {
    key: "backgrounds/tab-community-dark.png",
    category: "backgrounds",
    mimeType: "image/png",
    cdnUrl: `${R2_PUBLIC_BASE_URL}/backgrounds/tab-community-dark.png`
  },
  "backgrounds/tab-community-light.png": {
    key: "backgrounds/tab-community-light.png",
    category: "backgrounds",
    mimeType: "image/png",
    cdnUrl: `${R2_PUBLIC_BASE_URL}/backgrounds/tab-community-light.png`
  },
  "backgrounds/tab-community.png": {
    key: "backgrounds/tab-community.png",
    category: "backgrounds",
    mimeType: "image/png",
    cdnUrl: `${R2_PUBLIC_BASE_URL}/backgrounds/tab-community.png`
  },
  "backgrounds/tab-deeds-dark.png": {
    key: "backgrounds/tab-deeds-dark.png",
    category: "backgrounds",
    mimeType: "image/png",
    cdnUrl: `${R2_PUBLIC_BASE_URL}/backgrounds/tab-deeds-dark.png`
  },
  "backgrounds/tab-deeds-light.png": {
    key: "backgrounds/tab-deeds-light.png",
    category: "backgrounds",
    mimeType: "image/png",
    cdnUrl: `${R2_PUBLIC_BASE_URL}/backgrounds/tab-deeds-light.png`
  },
  "backgrounds/tab-deeds.png": {
    key: "backgrounds/tab-deeds.png",
    category: "backgrounds",
    mimeType: "image/png",
    cdnUrl: `${R2_PUBLIC_BASE_URL}/backgrounds/tab-deeds.png`
  },
  "backgrounds/tab-map-dark.png": {
    key: "backgrounds/tab-map-dark.png",
    category: "backgrounds",
    mimeType: "image/png",
    cdnUrl: `${R2_PUBLIC_BASE_URL}/backgrounds/tab-map-dark.png`
  },
  "backgrounds/tab-map-light.png": {
    key: "backgrounds/tab-map-light.png",
    category: "backgrounds",
    mimeType: "image/png",
    cdnUrl: `${R2_PUBLIC_BASE_URL}/backgrounds/tab-map-light.png`
  },
  "backgrounds/tab-map.png": {
    key: "backgrounds/tab-map.png",
    category: "backgrounds",
    mimeType: "image/png",
    cdnUrl: `${R2_PUBLIC_BASE_URL}/backgrounds/tab-map.png`
  },
  "backgrounds/tab-profile-dark.png": {
    key: "backgrounds/tab-profile-dark.png",
    category: "backgrounds",
    mimeType: "image/png",
    cdnUrl: `${R2_PUBLIC_BASE_URL}/backgrounds/tab-profile-dark.png`
  },
  "backgrounds/tab-profile-light.png": {
    key: "backgrounds/tab-profile-light.png",
    category: "backgrounds",
    mimeType: "image/png",
    cdnUrl: `${R2_PUBLIC_BASE_URL}/backgrounds/tab-profile-light.png`
  },
  "backgrounds/tab-profile.png": {
    key: "backgrounds/tab-profile.png",
    category: "backgrounds",
    mimeType: "image/png",
    cdnUrl: `${R2_PUBLIC_BASE_URL}/backgrounds/tab-profile.png`
  },
  "backgrounds/tab-today-dark.png": {
    key: "backgrounds/tab-today-dark.png",
    category: "backgrounds",
    mimeType: "image/png",
    cdnUrl: `${R2_PUBLIC_BASE_URL}/backgrounds/tab-today-dark.png`
  },
  "backgrounds/tab-today-light.png": {
    key: "backgrounds/tab-today-light.png",
    category: "backgrounds",
    mimeType: "image/png",
    cdnUrl: `${R2_PUBLIC_BASE_URL}/backgrounds/tab-today-light.png`
  },
  "backgrounds/tab-today.png": {
    key: "backgrounds/tab-today.png",
    category: "backgrounds",
    mimeType: "image/png",
    cdnUrl: `${R2_PUBLIC_BASE_URL}/backgrounds/tab-today.png`
  },
  "backgrounds/world-map-bg.png": {
    key: "backgrounds/world-map-bg.png",
    category: "backgrounds",
    mimeType: "image/png",
    cdnUrl: `${R2_PUBLIC_BASE_URL}/backgrounds/world-map-bg.png`
  },
  "logo/foobow-logo.png": {
    key: "logo/foobow-logo.png",
    category: "logo",
    mimeType: "image/png",
    cdnUrl: `${R2_PUBLIC_BASE_URL}/logo/foobow-logo.png`
  },
  "logo/lotus-logo.png": {
    key: "logo/lotus-logo.png",
    category: "logo",
    mimeType: "image/png",
    cdnUrl: `${R2_PUBLIC_BASE_URL}/logo/lotus-logo.png`
  },
  "objects/earth-globe-3d.png": {
    key: "objects/earth-globe-3d.png",
    category: "objects",
    mimeType: "image/png",
    cdnUrl: `${R2_PUBLIC_BASE_URL}/objects/earth-globe-3d.png`
  },
  "objects/earth-globe.png": {
    key: "objects/earth-globe.png",
    category: "objects",
    mimeType: "image/png",
    cdnUrl: `${R2_PUBLIC_BASE_URL}/objects/earth-globe.png`
  },
  "objects/lotus-glow.png": {
    key: "objects/lotus-glow.png",
    category: "objects",
    mimeType: "image/png",
    cdnUrl: `${R2_PUBLIC_BASE_URL}/objects/lotus-glow.png`
  }
};

/**
 * Returns the CDN URL or asset key for a Foobow asset.
 */
export function getAssetUri(key: FoobowAssetKey, useCdn: boolean = true): string {
  if (useCdn) {
    return ASSET_CATALOG[key]?.cdnUrl || `${R2_PUBLIC_BASE_URL}/${key}`;
  }
  return key;
}
