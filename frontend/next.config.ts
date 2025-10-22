import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export",
  async rewrites() {
    return [
      {
        source: "/api.thehyperscope/:path*", 
        destination: "https://api.thehyperscope.com/api/v1/:path*", 
      },
    ]
  },
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
