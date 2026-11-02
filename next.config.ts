import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 生产构建输出到 .next/standalone，配合 pnpm copy / deploy 使用
  output: "standalone",
  reactCompiler: true,
  reactStrictMode: true,
};

export default nextConfig;
