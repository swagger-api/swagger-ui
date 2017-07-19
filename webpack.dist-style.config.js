const ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = [{ 
  test: /\.(css)(\?.*)?$/,
  use: ExtractTextPlugin.extract({
    fallback: "style-loader",
    use: [
      "css-loader",
      "postcss-loader"
    ]
  })
},
{ test: /\.(scss)(\?.*)?$/,
  use: ExtractTextPlugin.extract({
    fallback: "style-loader",
    use: [
      {
        loader: "css-loader",
        options: { minimize: true }
      },
      {
        loader: "postcss-loader",
        options: { sourceMap: true }
      },
      { loader: "sass-loader",
        options: {
          outputStyle: "expanded",
          sourceMap: true,
          sourceMapContents: "true"
        }
      }
    ]
  })
}]