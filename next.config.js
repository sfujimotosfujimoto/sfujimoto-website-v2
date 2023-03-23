/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx"],
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
