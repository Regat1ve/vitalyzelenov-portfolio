import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // игра лежит статикой в public/, а ссылка должна быть без index.html
  async rewrites() {
    return [{ source: "/games/kuznets", destination: "/games/kuznets/index.html" }];
  },
};

export default nextConfig;
