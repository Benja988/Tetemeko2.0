import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export",
  typescript: {
    ignoreBuildErrors: true,
  },  
  eslint: {
    ignoreDuringBuilds: true, 
  },
  images: {
    domains: ['res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tetemeko.co.ke",
      },
    ],
  },
};

export default nextConfig;
