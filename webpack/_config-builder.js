/**
 * @prettier
 */

const path = require("path")
const deepExtend = require("deep-extend")
const webpack = require("webpack")
const TerserPlugin = require("terser-webpack-plugin")
const nodeExternals = require("webpack-node-externals")

const { getRepoInfo } = require("./_helpers")
const pkg = require("../package.json")

const projectBasePath = path.join(__dirname, "../")

const baseRules = [
  {
    test: /\.jsx?$/,
    include: [
      path.join(projectBasePath, "src"),
      path.join(projectBasePath, "node_modules", "object-assign-deep"),
    ],
    loader: "babel-loader",
    options: {
      retainLines: true,
      cacheDirectory: true,
    },
  },
  {
    test: /\.(txt|yaml)$/,
    type: "asset/source",
  },
  {
    test: /\.svg$/,
    use: ["@svgr/webpack"],
  },
  {
    test: /\.(png|jpg|jpeg|gif)$/,
    type: "asset/inline",
  },
]

function buildConfig(
  {
    minimize = true,
    mangle = true,
    sourcemaps = true,
    includeDependencies = true,
  },
  customConfig
) {
  const gitInfo = getRepoInfo()

  var plugins = [
    new webpack.DefinePlugin({
      buildInfo: JSON.stringify({
        PACKAGE_VERSION: pkg.version,
        GIT_COMMIT: gitInfo.hash,
        GIT_DIRTY: gitInfo.dirty,
        BUILD_TIME: new Date().toUTCString(),
      }),
    }),
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]

  const completeConfig = deepExtend(
    {},
    {
      mode: "production",

      entry: {},

      output: {
        path: path.join(projectBasePath, "dist"),
        publicPath: "/dist",
        filename: "[name].js",
        chunkFilename: "[name].js",
        globalObject: "this",
        library: {
          // when esm, library.name should be unset, so do not define here
          // when esm, library.export should be unset, so do not define here
          type: "umd",
        },
      },

      target: "web",

      module: {
        rules: baseRules,
      },

      externals: includeDependencies
        ? {
            esprima: "esprima",
          }
        : [
            nodeExternals({
              importType: (moduleName) => {
                return `commonjs ${moduleName}`
              },
            }),
          ],
      resolve: {
        modules: [path.join(projectBasePath, "./src"), "node_modules"],
        extensions: [".web.js", ".js", ".jsx", ".json", ".less"],
        alias: {
          // these aliases make sure that we don't bundle same libraries twice
          // when the versions of these libraries diverge between swagger-js and swagger-ui
          "@babel/runtime-corejs3": path.resolve(
            __dirname,
            "..",
            "node_modules/@babel/runtime-corejs3"
          ),
          "js-yaml": path.resolve(__dirname, "..", "node_modules/js-yaml"),
          lodash: path.resolve(__dirname, "..", "node_modules/lodash"),
          "react-is": path.resolve(__dirname, "..", "node_modules/react-is"),
          "safe-buffer": path.resolve(
            __dirname,
            "..",
            "node_modules/safe-buffer"
          ),
        },
        fallback: {
          fs: false,
          stream: require.resolve("stream-browserify"),
        },
      },

      // If we're mangling, size is a concern -- so use trace-only sourcemaps
      // Otherwise, provide heavy souremaps suitable for development
      devtool: sourcemaps
        ? minimize
          ? "nosources-source-map"
          : "cheap-module-source-map"
        : false,

      performance: {
        hints: "error",
        maxEntrypointSize: 13312000,
        maxAssetSize: 133312000,
      },

      optimization: {
        minimize: !!minimize,
        minimizer: [
          (compiler) =>
            new TerserPlugin({
              terserOptions: {
                mangle: !!mangle,
                keep_classnames:
                  !customConfig.mode || customConfig.mode === "production",
                keep_fnames:
                  !customConfig.mode || customConfig.mode === "production",
                output: {
                  comments: false,
                },
              },
            }).apply(compiler),
        ],
      },
    },
    customConfig
  )

  // deepExtend mangles Plugin instances, this doesn't
  completeConfig.plugins = plugins.concat(customConfig.plugins || [])

  return completeConfig
}

module.exports = buildConfig
