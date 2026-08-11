import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd2104774mpe934.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'd19r6u3d126ojb.cloudfront.net',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/yacht-rental-dubai',
        destination: '/yacht-rental',
        permanent: true,
      },
      {
        source: '/yacht-rental-dubai/:path*',
        destination: '/yacht-rental/:path*',
        permanent: true,
      },
      {
        source: '/rent-a-car-dubai',
        destination: '/rent-a-car',
        permanent: true,
      },
      {
        source: '/rent-a-car-dubai/:path*',
        destination: '/rent-a-car/:path*',
        permanent: true,
      },
      {
        source: '/cheap-car-rental-dubai/:path*',
        destination: '/rent-a-car/:path*',
        permanent: true,
      },
      {
        source: '/luxury-car-rental-dubai/:path*',
        destination: '/rent-a-car/:path*',
        permanent: true,
      },
      {
        source: '/supercar-rental-dubai/:path*',
        destination: '/rent-a-car/:path*',
        permanent: true,
      },
      {
        source: '/supercar-rental-dubai',
        destination: '/rent-a-car',
        permanent: true,
      },
      {
        source: '/yachts',
        destination: '/yacht-rental',
        permanent: true,
      },
      {
        source: '/cars',
        destination: '/rent-a-car',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
