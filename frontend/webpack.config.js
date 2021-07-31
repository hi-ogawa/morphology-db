const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const mode = process.env.BUILD_MODE ?? "development";

module.exports = {
  target: "web",
  mode: mode,
  entry: path.resolve(__dirname, "src", "index.js"),
  output: {
    path: path.resolve(__dirname, "build", "webpack", mode),
    filename: "[name].js",
  },
  plugins: [new HtmlWebpackPlugin({ template: "src/index.html" })],
  resolve: {
    extensions: [".ts", ".tsx", "..."],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [path.resolve(__dirname, "src")],
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        include: [path.resolve(__dirname, "src")],
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "sass-loader" },
        ],
      },
    ],
  },
  devServer: {
    port: "8090",
  },
};
