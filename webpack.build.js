var webpack = require('webpack')
var text = require("extract-text-webpack-plugin")
var html = require('html-webpack-plugin')
var fs=require('fs')
function clear(_path) {
	if (fs.existsSync(_path)) {
		fs.readdirSync(_path).forEach(function(_file, _index) {
			var _curPath = _path + "/" + _file
			if (fs.statSync(_curPath).isDirectory()) {
				clear(_curPath, fs)
			} else {
				fs.unlinkSync(_curPath)
			}
		});
		fs.rmdirSync(_path)
		return true
	}
	return false
}
clear('./build/')


var config = {}
config.entry = {
	app: "./src/app.js",
	common: [
		'vue',
		'vue-router',
		'vue-resource',
	]
}
config.output = {
	path: "./build/static",
	publicPath: "https://jinzhe.github.io/vue-calendar/static/",
	filename: "app.[hash:3].js"
}
config.module = {
	loaders: [{
		test: /\.vue$/,
		loader: 'vue'
	}, {
		test: /\.js$/,
		loader: 'babel',
		exclude: /node_modules/
	}, {
		test: /\.(png|jpg|gif|ttf|eot|svg|woff|mp4)$/,
		loader: "file"
	}]
}

config.vue = {
	loaders: {
		css: text.extract("css"),
		js: 'babel'
	}
}

config.plugins = [
	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: '"production"'
		}
	}),
	new text('app.[hash:3].css'),
	new html({
		filename: '../index.html',
		template: './src/app.html',
		inject: true,
		minify: {
			removeComments: true,
			collapseWhitespace: true,
			removeAttributeQuotes: true
			// more options:
			// https://github.com/kangax/html-minifier#options-quick-reference
		}
	}),
	new webpack.optimize.CommonsChunkPlugin({
		name: "common",
		filename: "[name].[hash:3].js"
	}),
	new webpack.optimize.OccurenceOrderPlugin(),
	new webpack.optimize.UglifyJsPlugin({
		sourceMap: false,
		mangle: true,
		compress: {
			warnings: false
		}
	})
]
module.exports = config
