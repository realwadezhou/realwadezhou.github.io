import type { NextConfig } from 'next';

// GitHub Pages: `STATIC_EXPORT=1 PAGES_BASE_PATH=/hindsight-research-site npm run build`
// writes a static site. Without these variables the app builds for Workers as before.
const staticExport = !!process.env.STATIC_EXPORT;
const basePath = process.env.PAGES_BASE_PATH || undefined;

const nextConfig: NextConfig = staticExport
  ? { output: 'export', basePath, images: { unoptimized: true } }
  : {};

export default nextConfig;
