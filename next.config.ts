import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 生产构建输出到 .next/standalone，配合 pnpm copy / deploy 使用
  output: "standalone",
  // 数据库驱动不参与打包，交给 Node 直接 require
  serverExternalPackages: ["pg", "@electric-sql/pglite"],
  reactCompiler: true,
  reactStrictMode: true,
};

export default nextConfig;
