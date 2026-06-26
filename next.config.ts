import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const apiProxyTarget = (process.env.NEXT_API_PROXY_TARGET || '').replace(
  /\/$/,
  ''
);

const nextConfig: NextConfig = {
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  async rewrites() {
    const rewrites = [
      ...(apiProxyTarget
        ? [
            {
              source: '/resources/media/:path*',
              destination: `${apiProxyTarget}/resources/media/:path*`,
            },
          ]
        : []),
      {
        source: '/api/:path*',
        destination: `${apiProxyTarget}/api/:path*`,
      },
    ]

    return [
      ...rewrites,
    ]
  },
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
