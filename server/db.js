/*
* @Author: ChengLin
* @Date:   2017-07-30 15:31:10
* @Last Modified by:   ChengLin
* @Last Modified time: 2017-07-31 16:15:40
*/

'use strict';

const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/thdb');

const db = mongoose.connection;
db.once('error', () => console.log('Mongo connection error'));
db.once('open', () => console.log('Mongo connection successed'));

//定义模式treeholeSchema
const treeholeSchema = mongoose.Schema({
	content: String,
	date: Date,
	comment: Array,
	support: Number
});

//定义模型Model
const Models = {
	Treehole: mongoose.model('Treehole', treeholeSchema)
};

module.exports = Models;