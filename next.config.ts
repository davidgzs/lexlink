
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // Add the Firebase Studio development origin here
    // It's good practice to include the protocol (https://)
    allowedDevOrigins: [
        'https://9000-firebase-studio-1748902130860.cluster-oayqgyglpfgseqclbygurw4xd4.cloudworkstations.dev'
    ],
  },
};

export default nextConfig;
