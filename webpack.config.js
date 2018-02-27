const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	context : path.resolve(__dirname),  //base directory, make webpack config independent from current working directory
	entry : {
		main : './src/index.js' //tell webpack where to start bundling your app
	},
	output : {
		filename: '[name].[chunkhash].js', // the output file's name
		path : path.resolve(__dirname, 'dist'), // where the file will be placed
		publicPath : '/' //the path to access from the web
	},
	devtool : 'inline-source-map', // output source map, use to debug in browser devtools
	module : {
		rules : [
			{
				test: /\.(js)$/,
				exclude: /node_modules/,
				use: ['babel-loader']
			},
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true, // turn css selectors into hashes
                importLoaders: 1, // 1 loader will be applied before css-loader
                camelCase: true,
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  ctx: {
                    autoprefixer: {
                      browsers: 'last 2 versions' //only support last 2 versions of browser
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
				loader: 'responsive-loader',
				options: {
					sizes: [360, 800, 1200, 1400],
					placeholder: true,
					adapter: require('responsive-loader/sharp'),
					name: './assets/images/[hash]-[width].[ext]'
				}
		 }
		]
	},
	plugins : [
	  new ExtractTextPlugin({
		  filename: 'styles/styles.[contenthash].css',
		  allChunks: true
	  }),
    new HtmlWebpackPlugin({
      template: `public/index.html`,
      //favicon: `public/favicon.ico`
	  }),
		new webpack.optimize.CommonsChunkPlugin({
			names : ['vendor', 'runtime']
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
		publicPath : '/',
	  host: 'localhost', // combine with port, will server your app through localhost:8080
	  port: 8080,
	  historyApiFallback: true
	}
}
