let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
let bcrypt = require('bcryptjs');
let Utilisateur = require('../models/utilisateur');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(require('../middlewares/flash'));

router.get('/', function(req, res, next) {
    res.render('login');
});

router.post('/form_log', (request, response)=>{
  Utilisateur.findUsers3(request.body.name, (result, err)=>{
    if (err) throw err
    else{
      console.log('JE REntre ICI')
      if (result === undefined){
        request.flash('error', "Pseudo inconnu")
      }else{
        console.log('jjjj', request.body.password, '/////', result[0].pwd, '------>', bcrypt.compareSync(request.body.password, result[0].pwd))
        if (bcrypt.compareSync(request.body.password, result[0].pwd)){
          console.log('CA RENTRE PAS ?')
        
          request.flash('success', "bien Connecte")
          request.session.user = result[0];
        }
        else
          request.flash('error', "mauvais mdp")
      }
    }
    response.redirect('/compte');
  })
})

module.exports = router;