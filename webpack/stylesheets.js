/**
 * @prettier
 */

// NOTE: this config *does not* inherit from `_config-builder`.
// It is also used in the dev config.

const path = require("path")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

// Namespaces Tailwind's global `--tw-*` variables and layers (see the ui-shell spec).
const tailwindNamespace = () => ({
  postcssPlugin: "swagger-ui-tailwind-namespace",
  Declaration(decl) {
    if (decl.prop.startsWith("--tw-")) decl.prop = `--sui-${decl.prop.slice(2)}`
    if (decl.value.includes("--tw-"))
      decl.value = decl.value.replaceAll("--tw-", "--sui-tw-")
  },
  AtRule: {
    property(atRule) {
      if (atRule.params.startsWith("--tw-"))
        atRule.params = `--sui-${atRule.params.slice(2)}`
    },
    layer(atRule) {
      atRule.params = atRule.params
        .split(",")
        .map((name) => name.trim())
        .map((name) =>
          name.startsWith("swagger-ui.") ? name : `swagger-ui.${name}`
        )
        .join(", ")
    },
  },
})
tailwindNamespace.postcss = true

module.exports = {
  mode: "production",

  entry: {
    "swagger-ui": ["./src/style/main.scss", "./src/style/tailwind.css"],
  },

  module: {
    rules: [
      {
        test: [/\.css(\?.*)?$/],
        include: path.join(__dirname, "../src/style"),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: { sourceMap: true, importLoaders: 1 },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                sourceMap: true,
                plugins: [require("@tailwindcss/postcss")(), tailwindNamespace],
              },
            },
          },
        ],
      },
      {
        test: [/\.(scss)(\?.*)?$/],
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: { sourceMap: true },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                sourceMap: true,
                plugins: [
                  require("cssnano")(),
                  "postcss-preset-env", // applies autoprefixer
                ],
              },
            },
          },
          {
            loader: "sass-loader",
            options: {
              api: "modern-compiler",
              sourceMap: true,
              sassOptions: {
                quietDeps: true,
              },
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
  ],

  devtool: "source-map",

  output: {
    path: path.join(__dirname, "../", "dist"),
    publicPath: "/dist",
  },
}
