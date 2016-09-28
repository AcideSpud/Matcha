let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	  res.render('login');
});

router.use(bodyParser.urlencoded({ extended: false }));

//request message flash module
router.use(require('../middlewares/flash'));


router.post('/form_log', (request, response)=>{
  let Utilisateur = require('../models/utilisateur')
  Utilisateur.findUsers3(request.body.name, (result, err)=>{
    if (err){
      console.log('error: ', err)
    } 
    else{
      if (result === undefined){
        request.flash('error', "Pseudo inconnu")
      }else{
          console.log('REQUEST', request.body.password)
          console.log('PASS', result[0].pwd)
        if (request.body.password === result[0].pwd){
          //set info cookie
          request.flash('success', "bien Connecte")
          request.session.user = result[0];
          console.log('SESSION USER', request.session.user)
        }
        else{
          request.flash('error', "mauvais mdp")
        }
      }
    }
    response.redirect('/');
  })
})
module.exports = router;

