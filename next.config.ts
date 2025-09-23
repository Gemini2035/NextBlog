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
};

export default withContentlayer(withNextIntl(nextConfig));
