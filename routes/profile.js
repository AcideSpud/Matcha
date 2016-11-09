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
        User.GetDB((db)=> {
            User.updateVisit(req.params.userID, db, req.session.user.name);
            User.updatePop(ret[0].popularite + 1, ret, db);
                var islike = false;
                if (ret[0].liker) {
                    for (var i = 0, len = ret[0].liker.length; i < len; i++) {
                        if (ret[0].liker[i] == req.session.user.name) {
                            islike = true;
                        }
                    }
                }
            res.render('profile', {
                ret: ret,
                islike: islike,
                user: req.session.user.name
            });
        });
    });
});
    //next();

router.post('/like/:Namelike', requireLogin, (req, res) =>{
    User.GetDB((db)=> {

        Profile.findUsers4(req.params.Namelike.substring(1), (ret)=> {

            User.updatePop(ret[0].popularite + 3, ret, db);
                User.updateLikeUser(req.session.user, db, req.params.Namelike.substring(1));
                User.checkMatch(req.session.user, db, ret[0].name);

        });
    });

    res.end();
});

router.post('/unlike/:Nameunlike', requireLogin, (req, res)=>{
    User.GetDB((db)=> {
        Profile.findUsers4(req.params.Nameunlike.substring(1), (ret)=> {
            User.updatePop(ret[0].popularite -3, ret, db)
                User.updateUnlikeUser(req.session.user, db, req.params.Nameunlike.substring(1))
                User.checkUnMatch(req.session.user, db, ret[0].name);
        });
    });
    res.end();
});


module.exports = router;