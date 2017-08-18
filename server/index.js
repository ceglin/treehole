/*
* @Author: ChengLin
* @Date:   2017-07-30 15:31:10
* @Last Modified by:   ChengLin
* @Last Modified time: 2017-07-31 18:21:42
*/

'use strict';

const api = require('./api.js') 
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(api);

app.use(express.static(path.resolve(__dirname, '../build')));
app.get('/treehole', function(req, res){
	const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8');
	res.send(html);
});

app.listen(8080);
