const path = require("path");
const WebpackBar = require("webpackbar");

module.exports = {
  publicPath: "/",
  devServer: {
    // proxy: "http://10.3.171.152:8081"
  },
  chainWebpack: config => {
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule
      .use("vue-svg-loader")
      .loader("vue-svg-loader")
      .options({
        svgo: {
          plugins: [{ removeViewBox: false }]
        }
      });
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.js$/,
          include: path.resolve("src"),
          use: ["thread-loader"]
        }
      ]
    },
    plugins: [new WebpackBar()]
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
          math: "always"
        }
      }
    }
  }
};
