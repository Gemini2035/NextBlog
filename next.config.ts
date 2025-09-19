import type { NextConfig } from "next";
import { withContentlayer } from 'next-contentlayer2';

const nextConfig: NextConfig = {
  ...(process.env.NODE_ENV === 'production' && { output: 'export' }),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/Gemini2035.github.io' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/Gemini2035.github.io/' : '',
};

export default withContentlayer(nextConfig);
