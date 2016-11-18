/**
 * Created by tapostin on 11/16/16.
 */
var express = require('express');
var router = express.Router();
let Profile = require('../models/getDataUser');
let User = require('../models/utilisateur');
let timeAgo = require('node-time-ago');

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
            var islike = false;
            if (ret[0].liker) {
                for (var i = 0, len = ret[0].liker.length; i < len; i++) {
                    if (ret[0].liker[i] == req.session.user.name) {
                        islike = true;
                    }
                }
            }
            console.log("DATE NOW ::: "+ ret[0].visit[18].date);
            console.log("GET TIME AGO ::::"+ timeAgo(ret[0].visit[18].date));
            let visit = [];
            let cmp = 0;
            for (var i = 0; i < ret[0].visit.length; i++){
                if (ret[0].visit[i].user){
                    visit[cmp] = {"user" : ret[0].visit[i].user, "date" : timeAgo(ret[0].visit[i].date)}
                    cmp++;
                }
            }
            let time = timeAgo(ret[0].lastCo);
            res.render('myProfile', {
                ret: ret,
                islike: islike,
                time: time,
                user: req.session.user.name,
                visit: visit
            });
        });
    });
});

module.exports = router;