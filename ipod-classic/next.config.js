const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const basePath = "/ipod";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  basePath,
  output: "export",
  compiler: {
    styledComponents: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

// `basePath` means the app lives at /ipod, so GET / returns 404 in dev.
// Redirect root → /ipod so http://localhost:3000/ loads the iPod UI.
if (process.env.NODE_ENV === "development") {
  nextConfig.redirects = async () => [
    {
      source: "/",
      destination: "/ipod",
      basePath: false,
      permanent: false,
    },
  ];
}

module.exports = withBundleAnalyzer(nextConfig);
