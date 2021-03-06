/**
 * Created by tapostin on 10/6/16.
 */
var express = require('express');
var router = express.Router();
let Profile = require('../models/getDataUser');
let User = require('../models/utilisateur');
let timeAgo = require('node-time-ago');
let bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));

function requireLogin (req, res, next) {
    if (!req.user) {
        req.flash('error', "il faut s'autentifier")
        res.redirect('/login');
    } else {
        next();
    }
};

router.get('/:userID', requireLogin, (req, res, next)=>{
    if (req.params.userID === req.session.user.name){
        res.redirect('/compte');
    }
    else {
        Profile.findUsers4(req.params.userID, (ret)=> {
            if (ret) {
                User.GetDB((db)=> {
                    User.updateVisit(req.params.userID, db, req.session.user.name);
                    var islike = false;
                    var imlike = false;
                    if (ret[0].liker) {
                        for (var i = 0, len = ret[0].liker.length; i < len; i++) {
                            if (ret[0].liker[i] == req.session.user.name) {
                                islike = true;
                            }
                        }
                    }
                    if (ret[0].like) {
                        for (var i = 0, len = ret[0].like.length; i < len; i++) {
                            if (ret[0].like[i] == req.session.user.name) {
                                imlike = true;
                            }
                        }
                    }
                    User.findUsers3(req.session.user.name, (resu) => {
                        User.isReported(req.params.userID, resu, (isReport) => {
                            User.isBlocked(req.params.userID, resu, (isblck) => {
                                if (isReport == false) {
                                    User.updatePop(ret[0].popularite + 1, ret, db);
                                }

                                let time = timeAgo(ret[0].lastCo);
                                res.render('profile', {
                                    ret: ret,
                                    islike: islike,
                                    imlike: imlike,
                                    time: time,
                                    user: resu,
                                    isRpt: isReport,
                                    isBlck: isblck,
                                    autre: req.params.userID
                                });
                            });
                        })
                    });
                });
            }
        });
    }
});

router.post('/reporte/:name', requireLogin, (req, res)=>{
    User.findUsers3(req.params.name, (ret)=> {
        User.GetDB((db)=> {
            User.updateReported(ret, db);
            User.updateReported2(db, req.session.user.name, req.params.name);
            var islike = false;
            var imlike = false;
            if (ret[0].liker) {
                for (var i = 0, len = ret[0].liker.length; i < len; i++) {
                    if (ret[0].liker[i] == req.session.user.name) {
                        islike = true;
                    }
                }
            }
            if (ret[0].like) {
                for (var i = 0, len = ret[0].like.length; i < len; i++) {
                    if (ret[0].like[i] == req.session.user.name) {
                        imlike = true;
                    }
                }
            }
            res.end();
        });
    });
});


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
            User.updatePop(ret[0].popularite -3, ret, db);
                User.updateUnlikeUser(req.session.user, db, req.params.Nameunlike.substring(1));
                User.checkUnMatch(req.session.user, db, ret[0].name);
        });
    });
    res.end();
});

router.post('/block', (req, res)=>{
    User.GetDB((db)=>{
        User.updateBlock(db, req.body.user, req.body.block, ()=>{
            
        })
    })
})
router.post('/Unblock', (req, res)=>{
    User.GetDB((db)=>{
        User.updateUnblockUser(req.session.user, db,  req.body.block, ()=>{

        })
    })
})


module.exports = router;