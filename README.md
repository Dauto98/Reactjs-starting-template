

# ReactJs-starting-template

This repo includes basic setup for Webpack to use in React project

The guide will be divided in to small sections, each section will contain setup for 1 module or functionality.
For final configuration, you can check the repo.

(The code in the repo is for webpack 3 on branch master, the default branch here is webpack 4)

## Prerequisites

You need to have in your machine:

```
Nodejs
```

## Table of content
1. [gitignore](#gitignore-and-npm)
2. [eslint](#add-eslint)
3. [base webpack config](#set-up-webpack-configuration)
4. [html, css loaders and plugins](#install-some-common-loaders-and-plugins-for-html-css)
5. [dev-server](#webpack-dev-server)
6. [Babel](#set-up-babel)
7. [Splitchunk](#split-chunk)
8. [Naming modules and chunks](#naming-modules-and-chunks)
9. [Clean up dist folder](#clean-up-dist-folder)
10. [Responsive images](#make-images-responsive)
11. [Support legacy modules](#support-legacy-modules)
12. [Using env variable](#using-environment-variables)
13. [Minify js](#minify-js-files)
14. [npm script](#npm-script)
15. [Async component](#async-component-for-react)

TODO:
16.  Service worker
17. Webpack PWA plugin

## What we will install
* [Webpack](https://webpack.js.org/) - Module bundler
* [Babel](https://babeljs.io/) - Transpile JSX and "future" javascript features
* [Eslint](https://eslint.org/) - Make your Js code "healthier"

## Install
#### gitignore and npm
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
-----
#### Add eslint
Install eslint
```
npm install --save-dev eslint
```
Set up eslint config
```
./node_modules/.bin/eslint --init
```
Choose options that suiltable for you, if you say 'y' to React rule (and you should, this is react app, right?), add this to the `.eslintrc` file to remove JSX unused vars error
```
"extends": [
 	"eslint:recommended",
 	"plugin:react/recommended"
 ],
```
If you use object spread operator (eg. {...props}) then add this to `.eslintrc`
```
"parserOptions": {
   "ecmaFeatures": {
       ......
       "experimentalObjectRestSpread": true
    },
	.....
},
```

-----
#### Set up webpack configuration
Install webpack and webpack-cli (save or save-dev is based on your project)
```
npm install --save webpack webpack-cli
```
Create `webpack.config.js` file in your project root directory, add the following content to the file
```
const path = require("path");

module.exports = {
  mode : "development",
  context : path.resolve(__dirname), // make all relative path relative to this instead of cwd
  entry : {
    main : "./src/index.js" // chunkname : "path to start bundling this chunk"
  },
  output : {
    filename : "[name].[chunkhash].js", // name of the outputed files
    path : path.resolve(__dirname, "dist"), // where to put those files
    publicPath : "/" // the address seen from the web URL, after the domain
  },
  devtool: "eval" // source map
};
```
-------
#### Install some common loaders and plugins for html, css
```
npm install --save html-webpack-plugin css-loader mini-css-extract-plugin postcss-loader
```
- [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin): inject 'bundle.js' script tag to html template automatically for us
- [css-loader](https://github.com/webpack-contrib/css-loader): allow webpack to handle css file
- [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin): extract css out into external css files
- [postcss-loader](https://github.com/postcss/postcss-loader): prefix and minify css files

Add to the config file
```
.....
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  ....
  module : {
    rules : [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
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
      }
    ]
  },
  plugins : [
    new MiniCssExtractPlugin({
      filename: "[name].css", // sync chunk
      chunkFilename: "[id].css" // async chunk
    }),
    new HtmlWebpackPlugin({
      template: "public/index.html",
      //favicon: `public/favicon.ico` // if you have one
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
------
#### Webpack dev server
Config [webpack-dev-server](https://webpack.js.org/configuration/dev-server/#devserver), use to serve the app without coding the backend
```
npm install --save webpack-dev-server
```
Add to the config file
```
module.exports = {
  ......
  devServer: {
    publicPath : "/", // this need to be the same as output.publicPath
    host: "localhost", // combine with port, will server your app through localhost:8080
    port: 8080,
    historyApiFallback: true
  },
}
```
-----
#### Set up babel
Babel is used to transpile JSX and ES201x js code to older js standard for some old browser
Install
```
npm install --save @babel/core babel-loader @babel/preset-env @babel/preset-react @babel/plugin-proposal-class-properties @babel/plugin-proposal-object-rest-spread
```
- [babel-core](https://babeljs.io/docs/core-packages/): core dependency for babel
- [babel-loader](https://github.com/babel/babel-loader): using babel with webpack
- [babel-preset-env](https://github.com/babel/babel/tree/master/packages/babel-preset-env): transpile ES2015+ code
- [babel-preset-react](https://babeljs.io/docs/plugins/preset-react/): transpile JSX code
- [babel-plugin-transform-class-properties](https://babeljs.io/docs/en/babel-plugin-transform-class-properties/): using class properties in javascript class
- [babel-plugin-transform-object-rest-spread](https://babeljs.io/docs/en/babel-plugin-transform-object-rest-spread/): handle object spread operator

Create `.babelrc` in your project root directory,  this is the babel configuration file
```
//.babelrc
{
  "presets": ["@babel/preset-env", "@babel/preset-react"],
  "plugins": ["@babel/plugin-proposal-object-rest-spread", "@babel/plugin-proposal-class-properties"]
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
        use: ["babel-loader"]
      },
      .....
    ]
  }
}
```
------
#### Split chunk
In webpack 4, `optimization.splitChunks` is used instead of CommonsChunkPlugin and is turned on by default in production mode.
To split out the vendor code, add the following config
```
optimization : {
  runtimeChunk : true, // create a chunk containing webpack runtime coode
  splitChunks : {
    cacheGroups : {
      vendors : {
        test : /[\\/]node_modules[\\/]/, // get all modules in node_modules
        priority: -10,
        chunks : "all",
        name : "vendor"
      }
    }
  }
},
```
--------
#### Naming modules and chunk
Give each chunk and module a name instead of numeric id, which might break your long term caching (different id for the same chunk)
This is turned on by default in development mode
```
optimization : {
  namedModules : true,
  namedChunks : true,
},
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
-------
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

-----
#### Minify Js files
In webpack 4, minify js is enabled by default in production mode, so no need for configuration.
If you want to tweak some config, then
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
  optimization : {
    minimizer : [
      new UglifyJsPlugin({
        sourceMap : true,
        cache : true
      })
    ]
  }
}
```
------
#### npm script
For running cli command easier, we could add some to npm script
For example, in `package.json`
```
"scripts" : {
  "build": "webpack --config webpack.prod.config.js",
  "build-dev" : "webpack-dev-server"
}
```
-----
#### Async component for react
For the code to be interpreted correctly by webpack and babel, add the following babel plugins and config
Install
```
npm install --save babel-plugin-syntax-dynamic-import
```
In `.babelrc`
```
plugins : ["syntax-dynamic-import"],
comments : true
```
comments : true so that babel doesn't strip away comment like `/* webpackChunkName : foo */`

## Authors

* **Nguyen Duc Anh**  - [Dauto98](https://github.com/Dauto98)

## Reference
Some great articles which help me to finish this setup guide

[Predictable long term caching with Webpack](https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31)

[How commonschunkplugin work](https://stackoverflow.com/questions/39548175/can-someone-explain-webpacks-commonschunkplugin)

[Getting the most out of the CommonsChunkPlugin()](https://medium.com/webpack/webpack-bits-getting-the-most-out-of-the-commonschunkplugin-ab389e5f318)

[How to use Webpack with React: an in-depth tutorial](https://medium.freecodecamp.org/learn-webpack-for-react-a36d4cac5060)
