
# ReactJs-starting-template

This repo includes basic setup for Reactjs

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
For final configuration, you can check the repo

## Prerequisites

You need to have in your machine:

```
Nodejs
```

## What we will install

* [ReactJs](https://reactjs.org/) - UI library
* [React-router](https://github.com/ReactTraining/react-router) - Turn your app into SPA
* [React-prop-types](https://reactjs.org/docs/typechecking-with-proptypes.html) - Check the data type of the props
* [Semantic UI React](https://react.semantic-ui.com/introduction) - CSS framwork for React, of course you can use other like Bootstrap
* [Webpack](https://webpack.js.org/) - Module bundler
* [Babel](https://babeljs.io/) - Transpile JSX and "future" javascript features
* [Eslint](https://eslint.org/) - Make your Js code "healthier" 


## Installing from the ground up

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
Install webpack (3.11.0) (webpack 4.0.0 is released at the time this post is being written, and it has a lot of different configuration compare to v3)
```
npm install --save webpack@3.11.0
```
Create `webpack.config.js` file in your project root directory, add the following content to the file
```
const path = require('path');

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
}
```

Install loaders and plugins to enhance webpack functionality
```
npm install --save html-webpack-plugin css-loader style-loader extract-text-webpack-plugin postcss-loader
```
- [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin):(2.30.1) inject 'bundle.js' script tag to html template automatically for us
- [css-loader](https://github.com/webpack-contrib/css-loader)(0.28.10), [style-loader](https://github.com/webpack-contrib/style-loader)(0.20.2): allow webpack to handle css file 
- [extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin)(3.0.2): extract css out into external css files
- [postcss-loader](https://github.com/postcss/postcss-loader)(2.1.0): prefix and minify css files

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
            //favicon: `public/favicon.ico` // if you have one
			// we ensure that the output files is included in the right order since the config in CommonsChunkPlugin section
			// below somehow break the default sort function
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
We install v2.11.1 since the latest version require webpack v4
```
npm install --save webpack-dev-server@2.11.1
```
Add to the config file
```
module.exports = {
    ......
    devServer: {
        publicPath : '/', // this need to be the same as output.publicPath
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
- [babel-core](https://babeljs.io/docs/core-packages/)(6.26.0): core dependency for babel
- [babel-loader](https://github.com/babel/babel-loader)(7.1.2): using babel with webpack
- [babel-preset-env](https://github.com/babel/babel/tree/master/packages/babel-preset-env)(1.6.1): transpile ES2015+ code
- [babel-preset-react](https://babeljs.io/docs/plugins/preset-react/)(6.24.1): transpile JSX code

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
We will create a sample React app and serve it by webpack-dev-server

Install dependencies

```
npm install --save react react-dom react-router-dom semantic-ui-react
```

- react, react-dom: core react packages
- react-router-dom: react routing package for web app
- semantic-ui-react: CSS framwork

This is the current files structure
```
|--node_modules
|--.babelrc
|--.gitignore
|--package-lock.json
|--package.json
|--postcss.config.js
|--webpack.config.js
```
Let create files and folders so it looks like this, the dist folder will be created when we run webpack
```
|--assets                 // folder containing images, gif and stuff
|--node_modules
|--public                 // folder containing HTML, favicon
    |--index.html         // base html file
|--src                    // folder containing JS and CSS file
    |--components         // folder containing React components
        |--app            // the app component folder
            |--app.css
            |--app.js
        |--home           // the home component folder
            |--home.css
            |--home.js
    |--index.js           // base JS file
|--.babelrc
|--.gitignore
|--package-lock.json
|--package.json
|--postcss.config.js
|--webpack.config.js
```
In the `index.html`, add the following
```
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>React-starting-template</title>

      <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.13/semantic.min.css"></link>
    </head>

    <body>
      <div id="root"></div>
    </body>
</html>
```
In the `index.js`, add the following
```
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/app.js';

ReactDOM.render(<App />, document.getElementById('root'));
```
This code render App component to the screen, let add content to the `app.js` file
```
import React from 'react';
import { Switch, BrowserRouter, Route, Link } from 'react-router-dom';

import { Divider } from 'semantic-ui-react';

import Home from '../home/home.js';

const App = () => {
  return (
        <BrowserRouter>
            <div>
                <nav>
                    <Link to='/'>Home</Link>
                </nav>
                <Divider />
                <Switch>
                    <Route exact path="/" component={Home} />
                </Switch>
            </div>
        </BrowserRouter>
  );
};

export default App;
```
This component render Home component in Route component when the url is matched

Let's open `home.js` file and code 
```
import React from 'react';
import { Header } from 'semantic-ui-react';

import { h1 } from './home.css';

const Home = () => {
    return (
        <Header as="h1" className={h1}>
            Hello world
        </Header>
    )
}

export default Home;
```
In `home.css`
```
.h1 {
    font-weight: 400;
}
```
Now, run this in your terminal (cd to your project root directory) 
```
npx webpack
```
Compile everything and put into the `dist` folder
```
npx webpack-dev-server
```
Now open http://localhost:8080/ you should see your app

------
#### Commons chunk plugin
This section is about optimize bundle with [commons chunk plugin](https://webpack.js.org/plugins/commons-chunk-plugin/)
For more detail about this setup, take a look at these great articles

[Predictable long term caching with Webpack](https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31)

[How to bundle vendor scripts separately and require them as needed with Webpack?](https://stackoverflow.com/questions/30329337/how-to-bundle-vendor-scripts-separately-and-require-them-as-needed-with-webpack)


Install name-all-modules-plugin
```
npm install --save name-all-modules-plugin
```

Add this to your `webpack.config.js`
```
......
const webpack = require('webpack');
const NameAllModulesPlugin = require("name-all-modules-plugin");

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
    .....
    plugins : [
        ....
		new webpack.NamedChunksPlugin(),
		new webpack.NamedModulesPlugin(),
		new NameAllModulesPlugin(),
		// Extract all node modules so that this chunk is not affected when we change our code
        // help in caching
		new webpack.optimize.CommonsChunkPlugin({
			names : ["vendor"],
			minChunks: function(module) {
				return isExternal(module);
			}
		}),
		// Extract all common thing in our code
		new webpack.optimize.CommonsChunkPlugin({
			names : ["common"],
			chunks : ["main"], // Specify our chunk name to search for common modules
			minChunks : function (module, count) {
				return !isExternal(module) && count > 1;
			}
		}),
		// Extract webpack runtime code
		new webpack.optimize.CommonsChunkPlugin({
			names : ["runtime"],
			minChunks: Infinity
		}),
    ]
}
```
The vendor will contain module shared between chunks and runtime contains webpack runtime code
Now run webpack again and you will see more output files with smaller size

------
####  Make images responsive
This section is about processing images through webpack so that it is "responsive"
Install
```
npm install --save responsive-loader sharp
```

In `webpack.config.js`
```
module.exports = {
    ......
    module : {
        rules : [
            .....
            {
                test: /\.(jpe?g|png)$/i,
                loader: 'responsive-loader',
                options: {
                    sizes: [360, 800, 1200, 1400], // the width of the output images, you should adapt to your app
                    placeholder: true,
                    adapter: require('responsive-loader/sharp'),
                    name: './assets/images/[hash]-[width].[ext]'
                }
            }
        ]
    }
}
```
-----
#### Support legacy modules
This section is about dealing with legacy modules with rely on global variable
we will use webpack built-in [ProvidePlugin](https://webpack.js.org/plugins/provide-plugin/)

In `webpack.config.js`
```
module.exports = {
    .....
    plugins : [
        .....
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
    ]
}
```
For example, the above config will import jquery to global context so that you and legacy library can use it with import it

------
#### Using environment variables
Usually, you won't hard-code directly some variable such as REST endpoint, auth key, you will provide it through environment variable
In backend, you can achieve this with `.env` file and dot-env package, but in frontend, you also need to pass it through webpack by [DefinePlugin](https://webpack.js.org/plugins/define-plugin/)

In `webpack.config.js`
```
module.exports = {
    .....
    plugins : [
        .....
        new webpack.DefinePlugin({
            'process.env.API_URL': JSON.stringify(process.env.API_URL),
        })
    ]
}
```
This config is depend on the host/platform you use, so the above code is just an example.

------
#### Minify Js files
Install plugin
```
npm install --save uglifyjs-webpack-plugin
```
Add in `webpack.config.js`
```
....
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    ......
    plugins : [
        ......
        new UglifyJsPlugin({
            sourceMap : true,
            cache : true
        })
    ]
}
```
------
#### Add eslint
Install eslint
```
npm install --save-dev eslint
```
Set up eslint config
```
./node_modules/.bin/eslint --init
```
Choose options that suiltable for you, if you say 'y' to React rule (and you should, this is react app, right?), add this to the `.eslintrc` file to fix JSX unused vars bug
```
"extends": [
 	"eslint:recommended",
 	"plugin:react/recommended"
 ],
```
------
#### Clean up dist folder
Since you will change your code during development, sometime webpack outputted files to dist folder is different, and old files remained in the folder, we want to clean that up, so we will use [Clean-webpack-plugin](https://github.com/johnagan/clean-webpack-plugin)

Install 
```
npm install --save clean-webpack-plugin
```
In `webpack.config.js`:
```
.....
const CleanWebpackPlugin = require("clean-webpack-plugin");
....

module.exports = {
	.....
	plugins : [
		new CleanWebpackPlugin(path.resolve(__dirname, "./dist")),
	]
}

```

------
#### Production webpack configurations
All the config we are currently using are suitable for development only, to use for production, we need to tweak it a little bit
Create `webpack.prod.config.js` file, copy all the content from `webpack.config.js`, but with a few changes
```
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const NameAllModulesPlugin = require("name-all-modules-plugin");
const webpack = require('webpack');

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
    context : path.resolve(__dirname),
    entry : {
        main : './src/index.js'
    },
    output : {
        filename: '[name].[chunkhash].js',
        path : path.resolve(__dirname, 'dist'),
        publicPath : '/'
    },
    devtool : 'inline-source-map', // we don't need source map in production
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
                modules: true, 
                importLoaders: 1,
                camelCase: true,
                sourceMap: false // same as inline-source-map 
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  ctx: {
                    autoprefixer: {
                      browsers: 'last 2 versions' 
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
			template: "public/index.html",
			favicon : "public/favicon.ico",
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
		// Extract all node modules so that this chunk is not affected when we change our code
		// help in caching
		new webpack.optimize.CommonsChunkPlugin({
			names : ["vendor"],
			minChunks: function(module) {
				return isExternal(module);
			}
		}),
		// Extract all common thing in our code
		new webpack.optimize.CommonsChunkPlugin({
			names : ["common"],
			chunks : ["main"], // Specify our chunk name to search for common modules
			minChunks : function (module, count) {
				return !isExternal(module) && count > 1;
			}
		}),
		// Extract webpack runtime code
		new webpack.optimize.CommonsChunkPlugin({
			names : ["runtime"],
			minChunks: Infinity
		}),
        new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
      }),
        new webpack.DefinePlugin({
            'process.env.API_URL': JSON.stringify(process.env.API_URL)
        }),
        new UglifyJsPlugin({
            // sourceMap : true,
            cache : true
        })
    ],
    // we don't need dev-server, of course
    //devServer: {
    //   publicPath : '/',
    //  host: 'localhost', // combine with port, will server your app through localhost:8080
    //  port: 8080,
    // historyApiFallback: true
    //}
    
}
```
-----
#### npm script
For running cli command easier, we could add some to npm script
For example, in `package.json`
```
"scripts" : {
    "build": "webpack --config webpack.prod.config.js",
    "build-dev" : "webpack-dev-server"
}
```

## Authors

* **Nguyen Duc Anh**  - [Dauto98](https://github.com/Dauto98)

## Reference
Some great articles which help me to finish this setup guide

[Predictable long term caching with Webpack](https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31)

[How commonschunkplugin work](https://stackoverflow.com/questions/39548175/can-someone-explain-webpacks-commonschunkplugin)

[Getting the most out of the CommonsChunkPlugin()](https://medium.com/webpack/webpack-bits-getting-the-most-out-of-the-commonschunkplugin-ab389e5f318)

[How to use Webpack with React: an in-depth tutorial](https://medium.freecodecamp.org/learn-webpack-for-react-a36d4cac5060)
