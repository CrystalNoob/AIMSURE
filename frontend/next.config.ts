import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.bca.co.id",
      },
      {
        protocol: "https",
        hostname: "salamdigital.bankbsi.co.id",
      },
      {
        protocol: "https",
        hostname: "eform.bni.co.id",
      },
      {
        protocol: "https",
        hostname: "www.btn.co.id",
      },
      {
        protocol: "https",
        hostname: "bri.co.id",
      },
    ],
  },
};

export default nextConfig;
