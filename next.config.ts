import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: 'incremental'
  },
  typescript: {
    // En production, désactive cette option pour détecter les erreurs TypeScript
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  eslint: {
    // Désactive ESLint pendant le build pour Vercel
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
