const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const NameAllModulesPlugin = require("name-all-modules-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");

/**
 * check if the modules is from 3rd party
 */
function isExternal(module) {
	var context = module.context;

	if (typeof context !== "string") {
		return false;
	}

	return context.indexOf("node_modules") !== -1;
}

module.exports = {
	context : path.resolve(__dirname),  //base directory, make webpack config independent from current working directory
	entry : {
		main : "./src/index.js" //tell webpack where to start bundling your app
	},
	output : {
		filename: "[name].[chunkhash].js", // the output file's name
		path : path.resolve(__dirname, "dist"), // where the file will be placed
		publicPath : "/" //the path to access from the web
	},
	devtool : "inline-source-map", // output source map, use to debug in browser devtools
	module : {
		rules : [
			{
				test: /\.(js)$/,
				exclude: /node_modules/,
				use: ["babel-loader"]
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: [
						{
							loader: "css-loader",
							options: {
								modules: true, // turn css selectors into hashes
								importLoaders: 1, // 1 loader will be applied before css-loader
								camelCase: true,
								sourceMap: true
							}
						},
						{
							loader: "postcss-loader",
							options: {
								config: {
									ctx: {
										autoprefixer: {
											browsers: "last 2 versions" //only support last 2 versions of browser
										}
									}
								}
							}
						}
					]
				})
			},
			{
				test: /\.(jpe?g|png)$/i,
				loader: "responsive-loader",
				options: {
					sizes: [360, 800, 1200, 1400],
					placeholder: true,
					adapter: require("responsive-loader/sharp"),
					name: "./assets/images/[hash]-[width].[ext]"
				}
			}
		]
	},
	plugins : [
		new CleanWebpackPlugin(path.resolve(__dirname, "./dist")),
		new ExtractTextPlugin({
			filename: "styles/styles.[contenthash].css",
			allChunks: true
		}),
		new HtmlWebpackPlugin({
			template: "public/index.html",
			chunksSortMode : function orderEntryLast(a, b) {
				if (a.entry !== b.entry) {
					return b.entry ? 1 : -1;
				} else if (a.id.includes("vendor")) {
					return -1;
				} else if (b.id.includes("vendor")) {
					return 1;
				} else {
					return b.id - a.id;
				}
			}
		}),
		new webpack.NamedChunksPlugin(),
		new webpack.NamedModulesPlugin(),
		new NameAllModulesPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			names : ["vendor"],
			minChunks: function(module) {
				return isExternal(module);
			}
		}),
		new webpack.optimize.CommonsChunkPlugin({
			names : ["common"],
			chunks : ["main"],
			minChunks : function (module, count) {
				return !isExternal(module) && count > 1;
			}
		}),
		new webpack.optimize.CommonsChunkPlugin({
			names : ["runtime"],
			minChunks: Infinity
		}),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		}),
		// new webpack.DefinePlugin({})
		new UglifyJsPlugin({
			sourceMap : true,
			cache : true
		})
	],
	devServer: {
		publicPath : "/",
		host: "localhost", // combine with port, will server your app through localhost:8080
		port: 8080,
		historyApiFallback: true
	}
};
