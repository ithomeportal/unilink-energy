/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['unilinktransportation.com'],
  },
  // Enable static page generation with revalidation for real-time data
  experimental: {
    // Allow larger payloads for API routes
  },
}

module.exports = nextConfig
