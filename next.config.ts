import type { NextConfig } from "next";
import { withContentlayer } from 'next-contentlayer2';

const nextConfig: NextConfig = {
  // 强制使用静态导出模式，避免SSR相关问题
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // 禁用实验性功能，避免静态导出问题
  experimental: {
    // 禁用可能导致静态导出问题的功能
    serverComponentsExternalPackages: [],
  },
  // 确保所有页面都是静态生成的
  generateStaticParams: true,
  // 移除 basePath 和 assetPrefix，让 GitHub Pages 使用根路径
  // basePath: process.env.NODE_ENV === 'production' ? '/Gemini2035.github.io' : '',
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/Gemini2035.github.io/' : '',
};

export default withContentlayer(nextConfig);
