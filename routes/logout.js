let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
var timeAgo = require('node-time-ago');
let Ut = require('../models/utilisateur');

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

router.get('/', requireLogin, (req, res, next)=>{
    Ut.GetDB((db)=>{
        Ut.updateLastCo(db, Date.now(), req.session.user, (nothing) =>{
            Ut.isCo(req.session.user.name, false);
	       req.session.destroy((err)=> {
            if (err) {
             throw err
            }
            else {
                res.redirect('/')
            }
         });
	   });
    });
})

module.exports = router;