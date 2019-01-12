const path = require('path');
const withCSS = require("@zeit/next-css");
const withLess = require("@zeit/next-less");
const withBundleAnalyzer = require("@zeit/next-bundle-analyzer");

// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.less'] = (file) => {}
}

module.exports = withBundleAnalyzer(withLess(withCSS({
  analyzeBrowser: ["browser", "both"].includes(process.env.BUNDLE_ANALYZE),
  lessLoaderOptions: {
     javascriptEnabled: true
  },
  serverRuntimeConfig: {},
  publicRuntimeConfig: {
    apiUrl: 'http://localhost:3000'
  },
  webpack: (config) => {
    // antd has a bug in current realease which causes bundle to bloat...
    // see https://github.com/ant-design/ant-design/issues/12011#issuecomment-423173228
    config.resolve.alias["@ant-design/icons/lib/dist$"] = path.resolve(__dirname, "./client/icons.js")

    return config;
  }
})));
