const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname, "src/index.js"),
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "image-marker.min.js",
    library: "ImageMarker",
    libraryExport: "default",
    libraryTarget: "window"
  },
  module: {
    rules: [
      {
        use: "babel-loader",
        include: [path.resolve(__dirname, "src")]
      },
      {
        test: /\.css$/,
        include: [path.resolve(__dirname, "src")],
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["postcss-loader"]
        })
      }
    ]
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new ExtractTextPlugin("image-marker.min.css"),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      uglifyOptions: {
        compress: {
          warnings: false
        }
      }
    })
  ]
};
