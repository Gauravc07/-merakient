/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      },
    ],
    unoptimized: true,
  },
  experimental: {
    // serverComponentsExternalPackages: ['bcryptjs'], // Old name
    // serverExternalPackages: ['bcryptjs'], // This option is no longer recognized in Next.js 15
  },
  // Ensure API routes are handled correctly
  async rewrites() {
    return []
  },
}

export default nextConfig
