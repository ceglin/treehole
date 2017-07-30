/*
* @Author: ChengLin
* @Date:   2017-07-30 15:32:26
* @Last Modified by:   ChengLin
* @Last Modified time: 2017-07-30 18:32:12
*/

'use strict';

const models = require('./db')
const express = require('express')
const router = express.Router();

router.post('/api/login/createAccount', (req, res) => {
	let newAccount = new models.Login({
		account: req.body.account,
		password: req.body.password
	});

	newAccount.save((err, data) => {
		if(err){
			res.end(err);
		}else{
			res.send('createAccount successed');
		}
	})
})


router.get('/api/login/getAccount', (req, res) => {
	//通过模型去查找数据库

	models.Login.find((err, data) => {
		if(err){
			res.send(err);
		}else{
			res.send(data);
		}
	})
});

module.exports = router;