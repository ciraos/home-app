import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  distDir: ".next",
  output: "standalone",
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "s2.loli.net",
      port: "",
      pathname: "/2024/09/19/**"
    }]
  },
  pageExtensions: ["tsx", "ts", "jsx", "js"],
  reactCompiler: true,
  reactStrictMode: false
};

export default nextConfig;
