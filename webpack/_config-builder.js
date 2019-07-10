/**
 * @prettier
 */

import path from "path"
import os from "os"
import fs from "fs"
import deepExtend from "deep-extend"
import webpack from "webpack"
import UglifyJsPlugin from "uglifyjs-webpack-plugin"

import { getRepoInfo } from "./_helpers"
import pkg from "../package.json"
const nodeModules = fs.readdirSync("node_modules").filter(function(x) {
  return x !== ".bin"
})

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
    },
  },
  { test: /\.(txt|yaml)$/, loader: "raw-loader" },
  { test: /\.(png|jpg|jpeg|gif|svg)$/, loader: "url-loader" },
  {
    test: /\.(woff|woff2)$/,
    loader: "url-loader?",
    options: {
      limit: 10000,
    },
  },
  { test: /\.(ttf|eot)$/, loader: "file-loader" },
]

export default function buildConfig(
  {
    // hot = false, // TODO: implement
    minimize = false,
    mangle = false,
    sourcemaps = false,
    includeDependencies = true,
  },
  customConfig
) {
  const gitInfo = getRepoInfo()

  var plugins = [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: minimize ? JSON.stringify("production") : null,
      },
      buildInfo: JSON.stringify({
        PACKAGE_VERSION: pkg.version,
        GIT_COMMIT: gitInfo.hash,
        GIT_DIRTY: gitInfo.dirty,
        HOSTNAME: os.hostname(),
        BUILD_TIME: new Date().toUTCString(),
      }),
    }),
  ]

  if (minimize) {
    plugins.push(
      new UglifyJsPlugin({
        uglifyOptions: {
          mangle: !!mangle,
          compress: mangle
            ? {
                dead_code: true,
              }
            : false,
          beautify: !mangle,
        },
        sourceMap: !!sourcemaps,
      }),
      new webpack.LoaderOptionsPlugin({
        options: {
          context: projectBasePath,
        },
      }),
      new webpack.NoEmitOnErrorsPlugin()
    )
  }

  const completeConfig = deepExtend(
    {},
    {
      entry: {},

      output: {
        path: path.join(projectBasePath, "dist"),
        publicPath: "/dist",
        filename: "[name].js",
        chunkFilename: "[name].js",
        libraryTarget: "umd",
        libraryExport: "default", // TODO: enable
      },

      target: "web",

      node: {
        // yaml-js has a reference to `fs`, this is a workaround
        fs: "empty",
      },

      module: {
        rules: baseRules,
      },

      externals: includeDependencies
        ? {
            // json-react-schema/deeper depends on buffertools, which fails.
            buffertools: true,
          }
        : (context, request, cb) => {
            // webpack injects some stuff into the resulting file,
            // these libs need to be pulled in to keep that working.
            var exceptionsForWebpack = ["ieee754", "base64-js"]
            if (
              nodeModules.indexOf(request) !== -1 ||
              exceptionsForWebpack.indexOf(request) !== -1
            ) {
              cb(null, "commonjs " + request)
              return
            }
            cb()
          },

      resolve: {
        modules: [path.join(projectBasePath, "./src"), "node_modules"],
        extensions: [".web.js", ".js", ".jsx", ".json", ".less"],
        alias: {
          "js-yaml": "@kyleshockey/js-yaml", // TODO: fix??
        },
      },

      // If we're mangling, size is a concern -- so use trace-only sourcemaps
      // Otherwise, provide heavy souremaps suitable for development
      devtool: sourcemaps
        ? minimize
          ? "nosource-source-map"
          : "cheap-module-source-map"
        : false,
    },
    customConfig
  )

  // deepExtend mangles Plugin instances, this doesn't
  completeConfig.plugins = plugins.concat(customConfig.plugins || [])

  return completeConfig
}
