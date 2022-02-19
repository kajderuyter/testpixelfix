const { parsed: localEnv } = require("dotenv").config();

const webpack = require("webpack");
const apiKey = JSON.stringify(process.env.SHOPIFY_API_KEY);
const host = JSON.stringify(process.env.HOST)

module.exports = {
  webpack: (config) => {
    const env = { API_KEY: apiKey, HOST_URL: host };
    config.plugins.push(new webpack.DefinePlugin(env));

    // Add ESM support for .mjs files in webpack 4
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });

    return config;
  },
  async redirect() {
    return [
      {
        source: '/route/:path',
        destination: 'https://https://74f0-2a02-a210-2786-ce80-f4ae-5fec-32ce-34b8.ngrok.io/:path'
      }
    ]
  }
};
