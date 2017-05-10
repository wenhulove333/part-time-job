var path = require('path');

var node_dir = __dirname + '/node_modules';

module.exports = {
    entry: './src/main/js/app.js',
    devtool: 'sourcemaps',
    cache: true,
    debug: true,
    resolve: {
        alias: {
            'stompjs': node_dir + '/stompjs/lib/stomp.js',
        }
    },
    output: {
        path: __dirname,
        filename: './src/main/resources/static/built/bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style!css',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass']
            },
	    {
		test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
		query: {
                    plugins: ['transform-runtime'],
                    presets: ['es2015', 'stage-0', 'react']
                }
           }
        ]
    }
};

