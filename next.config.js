/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'logo.kertaskerja.cc',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
