let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
var multer = require('multer')
var upload = multer({dest: "../public/img/"})
let Utilisateur = require('../models/utilisateur')

router.use(bodyParser.urlencoded({ extended: false }));
router.use(require('../middlewares/flash'));

function requireLogin (req, res, next) {
  if (!req.user) {
    req.flash('error', "il faut s'autentifier")
    res.redirect('/login');
  } else {
    next();
  }
};

router.get('/', requireLogin, function(req, res, next) {
  Utilisateur.findUsers3(req.user.name, (result)=>{
    res.render('compte', {ret : result});
  })	  
});


router.post('/form_compte', upload.single('userFile'), (request, response)=>{
  
  Utilisateur.modifUser(request, (res, err)=>{
    if (err)
      request.flash('error', err)
    else
      request.flash('success', "informations bien enregistrées")
  })
  response.redirect('/upload_img')
})


module.exports = router;