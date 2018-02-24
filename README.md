# ReactJs-starting-template

This repo includes basic setup for Reactjs

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites

You need to have in your machine:

```
Nodejs
```

## What we will install

* [ReactJs](https://reactjs.org/) - UI library
* [React-router](https://github.com/ReactTraining/react-router) - Turn your app into SPA
* [Semantic UI React](https://react.semantic-ui.com/introduction) - CSS framwork for React, of course you can use other like Bootstrap
* [Webpack](https://webpack.js.org/) - Module bundler
* [Babel](https://babeljs.io/) - Transpile JSX and "future" javascript features


## Installing

First, add .gitignore file to your project root directory
```
# Bower dependency directory
bower_components

# Npm Dependency directories
node_modules/

# webpack's output directory
dist/

# dotenv environment variables file
.env

# some platform/IDE specific files
.DS_STORE
.idea
*.iml

```

Create package.json file, -y mean accept default values

```
npm init -y
```
----------
#### Set up webpack configuration
Install webpack
```
npm install --save webpack
```
Create `webpack.config.js` file in your project root directory, add the following content to the file
```
const path = require('path');

module.exports = {
	context : path.resolve(__dirname),  //base directory, make webpack config independent from current working directory
	entry : './src/index.js',  //starting point for webpack
	output : {
		filename: 'bundle.js', // the output file's name
		path : path.resolve(__dirname, 'dist'), // where the file will be placed
		publicPath : './' //the path to access from the web  
	},
	devtool : 'inline-source-map', // output source map, use to debug in browser devtools
}
```

Install loaders and plugins to enhance webpack functionality
```
npm install --save html-webpack-plugin css-loader style-loader extract-text-webpack-plugin postcss-loader
```
- [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin): inject 'bundle.js' script tag to html template automatically for us
- [css-loader](https://github.com/webpack-contrib/css-loader), [style-loader](https://github.com/webpack-contrib/style-loader): allow webpack to handle css file 
- [extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin): extract css out into external css files
- [postcss-loader](https://github.com/postcss/postcss-loader): prefix and minify css files

Add to the config file
```
.....
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	....
	module : {
		rules : [
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
		      favicon: `public/favicon.ico`
		  }),
	]
}
```
Create `postcss.config.js` file and add the following content
```
module.exports = {
  plugins: [require('autoprefixer')]
};
```

Config [webpack-dev-server](https://webpack.js.org/configuration/dev-server/#devserver), use to serve the app without coding the backend
```
npm install --save webpack-dev-server
```
Add to the config file
```
module.exports = {
	......
	devServer: {
	  host: 'localhost', // combine with port, will server your app through localhost:8080
	  port: 8080,
	  historyApiFallback: true
	}
}
```
-------
#### Set up babel
Babel is used to transpile JSX and ES201x js code to older js standard for some old browser
Install
```
npm install --save babel-core babel-loader babel-preset-env babel-preset-react
```
- [babel-core](https://babeljs.io/docs/core-packages/): core dependency for babel
- [babel-loader](https://github.com/babel/babel-loader): using babel with webpack
- [babel-preset-env](https://github.com/babel/babel/tree/master/packages/babel-preset-env): transpile ES2015+ code
- [babel-preset-react](https://babeljs.io/docs/plugins/preset-react/): transpile JSX code

Create `.babelrc` in your project root directory,  this is the babel configuration file
```
//.babelrc
{
	"presets": ["env", "react"]
}
```
Add rule to `webpack.config.js` file
```
module.exports = {
	......
	module : {
		rules : [
			{
		        test: /\.(js)$/,
		        exclude: /node_modules/,
		        use: ['babel-loader']
		     },
		     .....
		]
	}
}
```

------

#### Create React app

```
npm install --save react react-dom react-router-dom semantic-ui-react
```

- react, react-dom: core react packages
- react-router-dom: react routing package for web app
- semantic-ui-react: CSS framwork

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Nguyen Duc Anh** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone who's code was used
* Inspiration
* etc
