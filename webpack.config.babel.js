import webpack from 'webpack';

export default {
	entry: [
		'./src/main.jsx'
	],
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				include: __dirname + '/src',
				loader: 'babel-loader'
			}
		]
	},
	output: {
		path: __dirname + '/build',
		filename: 'bundle.js'
	},
	devtool: 'source-map'
}
