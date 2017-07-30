/*
* @Author: ChengLin
* @Date:   2017-07-30 15:31:10
* @Last Modified by:   ChengLin
* @Last Modified time: 2017-07-30 18:32:41
*/

'use strict';

const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/test');

const db = mongoose.connection;
db.once('error', () => console.log('Mongo connection error'));
db.once('open', () => console.log('Mongo connection successed'));

//定义模式loginSchema
const loginSchema = mongoose.Schema({
	account: String,
	password: String
});

//定义模型Model
const Models = {
	Login: mongoose.model('Login', loginSchema)
};

module.exports = Models;