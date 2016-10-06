var express = require('express');
var router = express.Router();

/* GET home page. */
let User = require('../models/getDataUser');
let Profile = require('../models/utilisateur');

router.get('/', function(req, res, next) {

	User.Create_db((ret)=>{
	    res.render('dashboard', {ret : ret});
	});

});

module.exports = router;

