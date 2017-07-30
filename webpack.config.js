/*
* @Author: ChengLin
* @Date:   2017-07-26 11:25:33
* @Last Modified by:   ChengLin
* @Last Modified time: 2017-07-30 18:26:42
*/

'use strict';
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var vue = require('vue-loader');

//获取当前目录（根目录）
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'src/main.js');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');

var plugins = [
	//提公用js到common.js文件中
	new webpack.optimize.CommonsChunkPlugin('common'),
	//将样式统一发布到style.css中
	new ExtractTextPlugin('style.css',{
	    allChunks: true
	}),
	//使用ProvidePlugin 加载使用频率高的依赖库
	new webpack.ProvidePlugin({
		$: 'webpack-zepto'
	}),

	new webpack.LoaderOptionsPlugin({
		vue: {
			loaders: {
				css: ExtractTextPlugin.extract("css-loader")
			}
		}
	})
];

module.exports = {
	entry: [APP_PATH],
	output: {
		//输出路径
		path: BUILD_PATH,
		//打包的js名
		filename: '[name].js',
		//指向异步加载的路径
		publicPath: __dirname + '/build/',
		//非主文件的命名规则
		chunkFilename: '[id].[name].js?[chunkhash]'
	},
	module: {
		loaders: [
			{
				test:/\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract("css-loader")
			},
	        {
		        test: /\.js$/,
		        loader: 'babel-loader'
		    },
		]
	},
	plugins: plugins,
	resolve: {
		alias: {
			'vue': 'vue/dist/vue.js'
		}
	}
}