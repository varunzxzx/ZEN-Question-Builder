var path = require('path')

SRC_DIR = path.join(__dirname, 'src')
DES_DIR = path.join(__dirname, 'dist')

module.exports = {
	entry: path.join(SRC_DIR, 'app.jsx'),
	output: {
		filename: 'bundle.js',
		path: path.join(DES_DIR, 'js')
	},
	cache: true,
	resolve: {
		extensions: ['.js', '.jsx', 'map']
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: [{
						loader: 'babel-loader',
						options: {
							babelrc: false,
							presets: [
								'es2015',
								'stage-2',
								'react'
							]
						}
				}]
			}, {
                test: /\.css$/,
                use: [{
                    loader: 'style-loader'
				}, {
                    loader: 'css-loader',
                    options: {
                        modules: true
                    }
				}]
            }, {
                test: /\.jsonp?$/,
                loader: 'json'
            }, {
                test: /\.(png|gif|jpe?g)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: '/img/[name]-[hash:8].[ext]'
                }
            }, {
                test: /\.(eot|woff|woff2|ttf|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 5000,
                    name: '/font/[name]-[hash:8].[ext]'
                }
            }
		]
	}
}
