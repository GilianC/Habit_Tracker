import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // ppr a été fusionné dans cacheComponents
    // cacheComponents: true, // Décommentez si vous voulez activer le Partial Prerendering
  },
  typescript: {
    // En production, désactive cette option pour détecter les erreurs TypeScript
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  // eslint n'est plus supporté dans next.config.ts
  // Utilisez .eslintrc.json à la place
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
