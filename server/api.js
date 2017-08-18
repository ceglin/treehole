/*
* @Author: ChengLin
* @Date:   2017-07-30 15:32:26
* @Last Modified by:   ChengLin
* @Last Modified time: 2017-07-31 16:16:51
*/

'use strict';

const models = require('./db')
const express = require('express')
const router = express.Router();

//新建一条数据
router.post('/treehole/createAccount', (req, res) => {
	let newAccount = new models.Treehole({
		content: req.body.content,
		date: new Date(),
		comment: ['好好好','妙妙妙'],
		support: 123,
	});
	newAccount.save((err, data) => {
		if(err){
			res.end(err);
		}else{
			res.send(req.body.content);
		}
	});
})

//通过模型去查找数据库
router.get('/treehole/getAccount', (req, res) => {
	models.Treehole.find((err, data) => {
		if(err){
			res.send(err);
		}else{
			res.send(data);
		}
	});
});

module.exports = router;