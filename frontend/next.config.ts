import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://cdn.sanity.io/**')],
  },
  // Contact moved to a section at the bottom of About; keep old links and search results working.
  async redirects() {
    return [{source: '/contact', destination: '/about#contact', permanent: true}]
  },
}

export default nextConfig
