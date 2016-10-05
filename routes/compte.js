let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();

function requireLogin (req, res, next) {
  if (!req.user) {
    req.flash('error', "il faut s'autentifier")
    res.redirect('/login');
  } else {
    next();
  }
};


/* GET home page. */
router.get('/', requireLogin, function(req, res, next) {
	  res.render('compte');
});
//request body parser
router.use(bodyParser.urlencoded({ extended: false }));

//request message flash module
router.use(require('../middlewares/flash'));

router.post('/form_compte', (request, response)=>{

  let Utilisateur = require('../models/utilisateur')
  Utilisateur.modifUser(request, (res, err)=>{
    if (err){
      console.log('error: ', err)
    } else {
      request.flash('success', "informations bien enregistrées")
    }
  })
  response.redirect('/')
})


module.exports = router;