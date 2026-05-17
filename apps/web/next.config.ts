import type { NextConfig } from "next";
import { withContentlayer } from 'next-contentlayer2';
import createNextIntlPlugin from 'next-intl/plugin';
import path from 'node:path';

const withNextIntl = createNextIntlPlugin();

// 检测是否为Windows平台
const isWindows = process.platform === 'win32';

const nextConfig: NextConfig = {
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  outputFileTracingRoot: path.join(__dirname, '../..'),
  async rewrites() {
    if (process.env.NODE_ENV !== 'development') {
      return []
    }

    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ]
  },
  images: {
    unoptimized: true,
  },
  serverExternalPackages: isWindows ? [] : ['contentlayer2'],
};

// 在Windows平台上跳过contentlayer
export default isWindows 
  ? withNextIntl(nextConfig)
  : withContentlayer(withNextIntl(nextConfig));
