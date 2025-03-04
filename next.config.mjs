/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    CURRENT_SEASON: process.env.CURRENT_SEASON,
  },
};

export default nextConfig;
