var express = require('express');
var router = express.Router();

/* GET home page. */


router.get('/', function(req, res, next) {
	let User = require('../models/getDataUser');
	User.Create_db((ret)=>{
		res.render('dashboard', {ret : ret});
	});

});
module.exports = router;

