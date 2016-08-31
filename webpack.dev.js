var webpack = require('webpack')

var config = {}
config.entry = {
	app: "./src/app.js"
}
config.output = {
	path: "./build/static",
	publicPath: "/static/",
	filename: "app.js"
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
		test: /\.mp4$/,
		loader: "file?mimetype=video/mp4"
	}, {
		test: /\.(png|jpg|gif|ttf|eot|svg|woff)$/,
		loader: "file"
	}]
}
config.vue = {
	loaders: {
		js: 'babel'
	}
}

// config.plugins = [
// 	new webpack.optimize.CommonsChunkPlugin({
// 		name: "common",
// 		filename: "[name].js"
// 	})
// ]
module.exports = config