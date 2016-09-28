/**
 * Created by tapostin on 9/22/16.
 */
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let express = require('express');
let router = express.Router();

/* GET insciption page. */
router.get('/', (req, res, next) => {
    res.render('inscription');
});

//request body parser
router.use(bodyParser.urlencoded({ extended: false }));

//request message flash module
router.use(require('../middlewares/flash'));

//POST view/inscription
router.post('/form_inscription', (req, res, next)=>{
    console.log(req.body);
    if (req.body.email === undefined || req.body.email == ''){
        req.flash('error', "Mettez une adresse email svp")
        res.redirect('/inscription')
    }
    else if (req.body.name === undefined || req.body.name == ''){
        req.flash('error', "Mettez un nom svp")
        res.redirect('/inscription')
    }
    else if (req.body.pwd === undefined || req.body.pwd == ''){
        req.flash('error', "Mettez un password svp")
        res.redirect('/inscription')
    }
    else {
        let mongo = require('mongodb').MongoClient
        let bcrypt = require('bcryptjs')
       let Utilisateur = require('./models/utilisateur')
        var deffered = Q.defer()

        Utilisateur.create(req, res, function () {
            req.flash('sucess', "Merci!")
            res.redirect('/')
        })
    }
    console.log("test");
});

module.exports = router;
