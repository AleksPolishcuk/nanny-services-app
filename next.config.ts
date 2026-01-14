import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ftp.goit.study",
        pathname: "/img/avatars/**",
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
