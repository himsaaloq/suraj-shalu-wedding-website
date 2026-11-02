/** @type {import('next').NextConfig} */
const longCache = "public, max-age=604800, stale-while-revalidate=86400";

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  async headers() {
    return [
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: longCache }] },
      { source: "/music/:path*", headers: [{ key: "Cache-Control", value: longCache }] },
      { source: "/favicon.svg", headers: [{ key: "Cache-Control", value: longCache }] },
    ];
  },
};

export default nextConfig;
