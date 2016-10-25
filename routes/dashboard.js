var express = require('express');
var router = express.Router();
let User = require('../models/getDataUser');
let getProfile = require('../models/utilisateur');

/* GET home page. */
function requireLogin (req, res, next) {
	if (!req.user) {
		req.flash('error', "il faut s'autentifier")
		res.redirect('/login');
	} else {
		next();
	}
};

router.get('/', requireLogin, function(req, res, next) {

	User.Create_db((ret)=>{
		getProfile.SortPrefSexUser(req.session.user, ret, (cb)=>{
			res.render('dashboard', {ret : cb});
		})
	});
});

module.exports = router;