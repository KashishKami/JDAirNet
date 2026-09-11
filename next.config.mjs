/** @type {import("next").NextConfig} */
const nextConfig = {
  // Static export in production — deployed as HTML/CSS/JS to Hostinger shared hosting
  // Dev mode stays fully dynamic for HMR, error overlays, etc.
  ...(process.env.NODE_ENV === "production" ? { output: "export" } : {}),

  // trailingSlash: true — every page exports as /slug/index.html
  // Apache resolves /slug/ -> slug/index.html natively. Visitor never sees .html
  trailingSlash: true,

  // next/image optimization is unavailable in static export — disabled globally
  images: {
    unoptimized: true,
  },
}

export default nextConfig
