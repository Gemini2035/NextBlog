import type { NextConfig } from "next";
import { withContentlayer } from 'next-contentlayer2';

const nextConfig: NextConfig = {
  ...(process.env.NODE_ENV === 'production' && { output: 'export' }),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // 移除 basePath 和 assetPrefix，让 GitHub Pages 使用根路径
  // basePath: process.env.NODE_ENV === 'production' ? '/Gemini2035.github.io' : '',
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/Gemini2035.github.io/' : '',
};

export default withContentlayer(nextConfig);
