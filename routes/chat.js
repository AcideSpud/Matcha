let express = require('express');
var router = express.Router();
var Utilisateur = require('../models/utilisateur')

function requireLogin (req, res, next) {
	if (!req.user) {
		req.flash('error', "il faut s'autentifier")
		res.redirect('/login');
	} else {
		next();
	}
};

router.get('/', requireLogin,  function(req, res, next) {
	Utilisateur.findUsers3(req.user.name, (result)=>{
    	res.render('chat2', {ret : result});
  })
});


module.exports = router;