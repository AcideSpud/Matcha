
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let express = require('express');
let router = express.Router();
let Utilisateur = require('../models/utilisateur');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(require('../middlewares/flash'));


//GET
router.get('/', (req, res, next) => {
    res.render('inscription');
});

//POST
router.post('/form_inscription2', (req, res, next)=>{

  if (req.body.name.length <= 4){
        req.flash('error', "Votre pseudo doit comporter au minimum 5 lettres")
        res.redirect('/inscription')
    }
    else if (req.body.pwd.length <= 4){
        req.flash('error', "le mot de passe doit comporter au minimum 5 lettres")
        res.redirect('/inscription')
    }
    else
        Utilisateur.create(req, res);
});

module.exports = router;