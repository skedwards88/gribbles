const path = require("path");
const WorkboxPlugin = require("workbox-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const packageJson = require("./package.json")

module.exports = (env, argv) => {
  if (argv.mode === "development") {
    console.log("RUNNING IN DEV MODE. Service worker will not generate.");
  } else {
    console.log("RUNNING IN NON-DEV MODE. Service worker will generate.");
  }

  const htmlPlugin = new HtmlWebpackPlugin({
    // Need to use template because need 'root' div for react injection. templateContent doesn't play nice with title, so just use a template file instead.
    template: "./src/index.html",
  });

  const copyPlugin = new CopyPlugin({
    patterns: [
      {from: "./src/images/favicon.svg", to: "./assets/favicon.svg"},
      {from: "./src/images/favicon.png", to: "./assets/favicon.png"},
      {from: "./src/images/icon_192.png", to: "./assets/icon_192.png"},
      {from: "./src/images/icon_512.png", to: "./assets/icon_512.png"},
      {from: "./src/images/maskable_192.png", to: "./assets/maskable_192.png"},
      {from: "./src/manifest.json", to: "./assets/manifest.json"},
      {from: "./src/privacy.html", to: "./privacy.html"},
      {
        from: "./src/images/screenshot-new-mobile.png",
        to: "./assets/screenshot-new-mobile.png",
      },
      {
        from: "./src/images/screenshot-progress-mobile.png",
        to: "./assets/screenshot-progress-mobile.png",
      },
      {
        from: "./src/images/screenshot-done-mobile.png",
        to: "./assets/screenshot-done-mobile.png",
      },
      {
        from: "./src/images/screenshot-settings-mobile.png",
        to: "./assets/screenshot-settings-mobile.png",
      },
      {
        from: "./src/images/screenshot-new-tablet.png",
        to: "./assets/screenshot-new-tablet.png",
      },
      {
        from: "./src/images/screenshot-progress-tablet.png",
        to: "./assets/screenshot-progress-tablet.png",
      },
      {
        from: "./src/images/screenshot-done-tablet.png",
        to: "./assets/screenshot-done-tablet.png",
      },
      {
        from: "./src/images/screenshot-settings-tablet.png",
        to: "./assets/screenshot-settings-tablet.png",
      },
    ],
    options: {
      concurrency: 100,
    },
  });

  const serviceWorkerPlugin = new WorkboxPlugin.GenerateSW({
    // these options encourage the ServiceWorkers to get in there fast
    // and not allow any straggling "old" SWs to hang around
    clientsClaim: true,
    skipWaiting: true,
    maximumFileSizeToCacheInBytes: 4200000, // special case to cache word list for offline play
    cacheId: packageJson.version,
  });

  const plugins =
    argv.mode === "development"
      ? [htmlPlugin, copyPlugin]
      : [htmlPlugin, copyPlugin, serviceWorkerPlugin];

  return {
    entry: "./src/index.js",
    mode: "production",
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: "babel-loader",
          options: {presets: ["@babel/env"]},
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        },
      ],
    },
    resolve: {extensions: ["*", ".js", ".jsx"]},
    output: {
      publicPath: "",
      filename: "bundle.[fullhash].js",
      path: path.resolve(__dirname, "dist"),
      clean: true, // removes unused files from output dir
    },
    performance: {
      maxEntrypointSize: 2700000, // special case to cache word list for offline play
      maxAssetSize: 2700000, // special case to cache word list for offline play
    },
    devServer: {
      static: "./dist",
      historyApiFallback: true,
    },
    plugins: plugins,
  };
};
