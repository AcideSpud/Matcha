var express = require('express');
var router = express.Router();

/* GET home page. */
function requireLogin (req, res, next) {
	if (!req.user) {
		req.flash('error', "il faut s'autentifier")
		res.redirect('/login');
	} else {
		next();
	}
};

let User = require('../models/getDataUser');

router.get('/', requireLogin, function(req, res, next) {

	User.Create_db((ret)=>{
	    res.render('dashboard', {ret : ret});
	});

});

module.exports = router;