import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const apiProxyTarget = (process.env.API_PROXY_TARGET ?? 'https://api.apodidae2035.com').replace(
  /\/$/,
  ''
);

const nextConfig: NextConfig = {
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiProxyTarget}/api/:path*`,
      },
    ]
  },
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
