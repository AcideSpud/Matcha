let express = require('express');
let app = express();
var router = express.Router();
var Utilisateur = require('../models/utilisateur')

/*function requireLogin (req, res, next) {
	if (!req.user) {
		req.flash('error', "il faut s'autentifier")
		res.redirect('/login');
	} else {
		next();
	}
};*/

router.get('/',  function(req, res, next) {
	console.log('coucou')
	res.render('chat2')
	//  Utilisateur.findUsers3(req.user.name, (result)=>{
	 // 	console.log('coucou2')
   // res.render('chat2', {ret : result});
 // })
});


module.exports = router;