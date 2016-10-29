let express = require('express');
let app = express();
let http = require('http');
var router = express.Router();
var Utilisateur = require('../models/utilisateur')

router.get('/',  function(req, res, next) {
	  Utilisateur.findUsers3(req.user.name, (result)=>{
    res.render('chat2', {ret : result});
  })
});


module.exports = router;