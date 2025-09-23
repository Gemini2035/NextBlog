import type { NextConfig } from "next";
import { withContentlayer } from 'next-contentlayer2';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();
const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['contentlayer2'],
  // 移除 basePath 和 assetPrefix，让 GitHub Pages 使用根路径
  // basePath: process.env.NODE_ENV === 'production' ? '/Gemini2035.github.io' : '',
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/Gemini2035.github.io/' : '',
  // 为 GitHub Pages 添加静态导出配置
  output: process.env.GITHUB_PAGES === 'true' ? 'export' : undefined,
  distDir: process.env.GITHUB_PAGES === 'true' ? 'out' : '.next',
};

export default withContentlayer(withNextIntl(nextConfig));
