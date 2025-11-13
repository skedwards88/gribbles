const path = require("path");
const webpack = require("webpack");
const WorkboxPlugin = require("workbox-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const packageJson = require("./package.json");

const appName = packageJson.displayName;
const issues = packageJson.bugs.url;

if (!appName || !issues) {
  throw new Error(
    "name and bugs.url must be populated in package.json for use in the privacy policy.",
  );
}

// Define app name as an env var for use by the sendAnalyticsCF function
const definePlugin = new webpack.DefinePlugin({
  "process.env.APP_NAME": JSON.stringify(packageJson.name),
});

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

  const privacyHtmlPlugin = new HtmlWebpackPlugin({
    filename: "privacy.html",
    template: require.resolve(
      "@skedwards88/shared-components/src/components/privacy.template.html",
    ),
    inject: false,
    templateParameters: {
      appName,
      issues,
    },
  });

  const copyPlugin = new CopyPlugin({
    patterns: [
      {from: "./src/images/favicon.svg", to: "./assets/favicon.svg"},
      {from: "./src/images/favicon.png", to: "./assets/favicon.png"},
      {from: "./src/images/icon_192.png", to: "./assets/icon_192.png"},
      {from: "./src/images/icon_512.png", to: "./assets/icon_512.png"},
      {from: "./src/images/maskable_192.png", to: "./assets/maskable_192.png"},
      {from: "./src/manifest.json", to: "./assets/manifest.json"},
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
    // This helps ensure that all pages will be controlled by a service worker immediately after that service worker activates
    clientsClaim: true,
    // This skips the service worker waiting phase, meaning the service worker activates as soon as it's finished installing
    skipWaiting: true,
    cacheId: `gribbles-${packageJson.version}`,
    // special case to cache word list for offline play
    maximumFileSizeToCacheInBytes: 4200000,
  });

  const plugins =
    argv.mode === "development"
      ? [definePlugin, htmlPlugin, privacyHtmlPlugin, copyPlugin]
      : [
          definePlugin,
          htmlPlugin,
          privacyHtmlPlugin,
          copyPlugin,
          serviceWorkerPlugin,
        ];

  return {
    entry: "./src/index.js",
    mode: "production",
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          include: [
            path.resolve(__dirname, "src"),
            path.dirname(
              require.resolve("@skedwards88/shared-components/package.json"),
            ),
          ],
          loader: "babel-loader",
          options: {presets: ["@babel/env"]},
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
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
      // special case to cache word list for offline play
      maxEntrypointSize: 2700000, // bytes
      // special case to cache word list for offline play
      maxAssetSize: 2700000, // bytes
    },
    devServer: {
      static: "./dist",
    },
    plugins: plugins,
  };
};
