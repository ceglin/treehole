/*
* @Author: ChengLin
* @Date:   2017-07-26 11:11:06
* @Last Modified by:   ChengLin
* @Last Modified time: 2017-07-31 17:21:18
*/

'use strict';

import Vue from 'vue'
import App from './vue/app.vue'
import VueRouter from 'vue-router'
//请求数据的模块，类似于ajax
import VueResource from 'vue-resource'
Vue.use(VueResource);

import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import 'muse-ui/dist/theme-teal.css' // 使用 teal 主题
Vue.use(MuseUI);
Vue.config.productionTip = false;


Vue.use(VueRouter);

import Home from './vue/home.vue'
import Square from './vue/square.vue'
import Me from './vue/me.vue'
import New from './vue/new.vue'


//实例化VueRouter
const router = new VueRouter({
	routes: [
		{
			path: '/',
			name:'Home',
			component: Home
		},
		{
			path: '/square',
			name: 'Square',
			component: Square
		},
		{
			path: '/me',
			name: 'Me',
			component: Me
		},
		{
			path: '/new',
			name: 'New',
			component: New
		}
	]
});

var vm = new Vue({
	el: "#app",
	router,
	template: '<app></app>',
	components: {
		App
	}
});

