import type { NextConfig } from "next";
import { withContentlayer } from 'next-contentlayer2';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

// 检测是否为Windows平台
const isWindows = process.platform === 'win32';

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  serverExternalPackages: isWindows ? [] : ['contentlayer2'],
};

// 在Windows平台上跳过contentlayer
export default isWindows 
  ? withNextIntl(nextConfig)
  : withContentlayer(withNextIntl(nextConfig));
