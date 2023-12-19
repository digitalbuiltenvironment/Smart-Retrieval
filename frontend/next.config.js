/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["llamaindex"],
  },
  env: {
    CHAT_API: "http://localhost:8000/api/chat",
  },
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true
  },
  publicRuntimeConfig: {
    serverActions: true,
  },
};

module.exports = nextConfig;
