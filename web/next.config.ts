import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const apiOrigin = process.env.API_ORIGIN ?? 'http://localhost:3001';

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  async rewrites() {
    // Same-origin proxy in front of the Nest API, so browser cookies from
    // Better Auth never have to cross a third-party origin.
    return [
      {
        source: '/api/auth/:path*',
        destination: `${apiOrigin}/api/auth/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${apiOrigin}/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
