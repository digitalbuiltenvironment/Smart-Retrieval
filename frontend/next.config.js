/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   serverComponentsExternalPackages: ["llamaindex"],
  // },
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true
  },
  publicRuntimeConfig: {
    serverActions: true,
  },
};

module.exports = nextConfig;
