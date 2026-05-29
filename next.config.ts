import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  async rewrites() {
    if (process.env.NODE_ENV !== 'development') {
      return []
    }

    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_PROXY_TARGET ?? 'https://admin.apodidae2035.com'}/api/:path*`,
      },
    ]
  },
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
