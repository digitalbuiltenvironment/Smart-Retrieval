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
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals.push({ "bufferutil": "bufferutil", "utf-8-validate": "utf-8-validate", "supports-color": "supports-color" }); 
    }
    return config;
  }
};

module.exports = nextConfig;
