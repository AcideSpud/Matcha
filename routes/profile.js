/**
 * Created by tapostin on 10/6/16.
 */
var express = require('express');
var router = express.Router();
let Profile = require('../models/getDataUser');
let User = require('../models/utilisateur');

function requireLogin (req, res, next) {
    if (!req.user) {
        req.flash('error', "il faut s'autentifier")
        res.redirect('/login');
    } else {
        next();
    }
};



router.get('/:userID', requireLogin, (req, res, next)=>{
    Profile.findUsers4(req.params.userID, (ret)=> {

        var islike = false;
        if (ret[0].liker) {
            for (var i = 0, len = ret[0].liker.length; i < len; i++) {
                if (ret[0].liker[i] == req.session.user.name) {
                    console.log("HERE BITCH !!! ");
                    islike = true;
                }
            }
        }

        console.log(islike);
            res.render('profile', {
                ret: ret,
                islike: islike
            });
    })
});
    //next();

router.post('/like/:Namelike', requireLogin, (req, res) =>{
    console.log("RECEVE POST BITCH !");
    console.log(req.session.user.name);

    User.GetDB((db)=> {
        User.updateLikeUser(req.session.user, db, req.params.Namelike.substring(1));
    });
    res.end();
});

router.post('/unlike/:Nameunlike', requireLogin, (req, res)=>{
    console.log("receve UNLIKE POST BITCH !");

    User.GetDB((db)=>{
        console.log(req.params.Nameunlike);
      User.updateUnlikeUser(req.session.user, db, req.params.Nameunlike.substring(1));
    });
    res.end();
});


module.exports = router;