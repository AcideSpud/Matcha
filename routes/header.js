let express = require('express');
var router = express.Router();
let bodyParser = require('body-parser');
var Utilisateur = require('../models/utilisateur')

router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res, next)=>{
	//res.render('/header_dash', {user: req.user.name});
	console.log('---', req.user.name);
})

router.get('/footer_dash', (req, res, next)=>{
})

module.exports = router;