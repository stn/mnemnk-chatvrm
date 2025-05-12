/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",

  reactStrictMode: true,
  assetPrefix: process.env.BASE_PATH || "",
  basePath: process.env.BASE_PATH || "",
  trailingSlash: true,
  publicRuntimeConfig: {
    root: process.env.BASE_PATH || "",
  },
  optimizeFonts: false,
};

module.exports = nextConfig;
