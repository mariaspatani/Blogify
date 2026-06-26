/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        // Firebase Auth Google profile photos
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

module.exports = nextConfig;
