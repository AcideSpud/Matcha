let express = require('express');
let router = express.Router();
let multer = require('multer');
let bodyParser = require('body-parser');
var upload = multer();
let User = require('../models/getDataUser');
let getProfile = require('../models/utilisateur');
var chatRoom = require('../models/chat_function')


function requireLogin (req, res, next) {
	if (!req.user) {
		req.flash('error', "il faut s'autentifier")
		res.redirect('/login');
	} else {
		next();
	}
};
function tcheckNotif (req){
    Utilisateur.findUsers3(req.session.user.name, (cb)=>{
        var nbNotif = 0;
        for (var i = 0; i < cb.notif.length; i++){
            if (cb.notif[i].isRead == false)
                nbNotif++;
        }
})}

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


router.get('/', requireLogin,  function(req, res, next) {
	User.Create_db((ret)=>{
        getProfile.findUsers3(req.session.user.name, (resu)=>{
        getProfile.sortReported(ret, resu, (ret)=>{
		    getProfile.SortPrefSexUser(req.session.user, ret, (cb)=> {
                getProfile.GetDistance(req.session.user, cb, (dist)=> {
                     getProfile.nbTag(req.session.user, dist, (cb)=> {
                            if (cb[0] && dist[0]){
                                for (let i = 0, len = dist.length; i < len; i++) {
                                for (let j = 0, lon = cb.length; j < lon; j++) {
                                    if (dist[i].name == cb[j].name) {
                                        dist[i].nTag = cb[j].size;
                                    }}
                                }
                            }
                            res.render('dashboard', {
                                ret: dist,
                                user: resu
                            });

                        });
                    });
                });
            });
		});
	});
});

router.post('/sort', upload.array(), requireLogin, (req, res)=> {
    if (req.body.data) {
        let data = JSON.parse(req.body.data);
        if (req.body.mySort == 1) {
            getProfile.sortAge(data, (cb)=>{
                res.contentType('json');
                res.send(JSON.stringify(cb));
            });
        }
        else if (req.body.mySort == 2) {
            getProfile.sortPop(data, (cb)=>{
                res.contentType('json');
                res.send(JSON.stringify(cb));
            });
        }
        else if (req.body.mySort == 3) {
            getProfile.GetDistance(req.session.user, data, (cb)=> {
                getProfile.sortDist(data, (cb)=> {
                    res.contentType('json');
                    res.send(JSON.stringify(cb));
                })
            });
        }
        else if (req.body.mySort == 4) {
            getProfile.nbTag(req.session.user, data, (cb)=>{
                for (let i = 0; i < data.length; i++){
                    for (let j = 0; j < cb.length;  j++){
                        if (data[i].name == cb[j].name){
                            data[i].nTag = cb[j].size;
                        }
                    }
                }
                getProfile.sortByTag(data, (mcb)=>{
                    res.contentType('json');
                    res.send(JSON.stringify(mcb));
                })
            })
        }
    }
    else {
        User.Create_db((array)=> {
            getProfile.findUsers3(req.session.user.name, (resu)=> {
                getProfile.sortReported(array, resu, (array) => {
                    getProfile.SortPrefSexUser(req.session.user, array, (ret) => {
                        if (req.body.mySort == 1) {
                            getProfile.sortAge(ret, (cb) => {
                                getProfile.GetDistance(req.session.user, cb, (geo) => {
                                    getProfile.nbTag(req.session.user, geo, (cb) => {
                                        for (let i = 0, len = geo.length; i < len; i++) {
                                            for (let j = 0, lon = cb.length; j < lon; j++) {
                                                if (geo[i].name == cb[j].name) {
                                                    geo[i].nTag = cb[j].size;
                                                }
                                            }
                                        }
                                        res.contentType('json');
                                        res.send(JSON.stringify(geo));
                                    });
                                });
                            });
                        }
                        else if (req.body.mySort == 2) {
                            getProfile.sortPop(ret, (cb) => {
                                getProfile.GetDistance(req.session.user, cb, (geo) => {
                                    getProfile.nbTag(req.session.user, geo, (cb) => {
                                        for (let i = 0, len = geo.length; i < len; i++) {
                                            for (let j = 0, lon = cb.length; j < lon; j++) {
                                                if (geo[i].name == cb[j].name) {
                                                    geo[i].nTag = cb[j].size;
                                                }
                                            }
                                        }
                                        res.contentType('json');
                                        res.send(JSON.stringify(geo));
                                    });
                                });
                            });
                        }
                        else if (req.body.mySort == 3) {
                            getProfile.GetDistance(req.session.user, ret, (cb) => {
                                getProfile.sortDist(cb, (ret) => {
                                    getProfile.nbTag(req.session.user, ret, (cb) => {
                                        for (let i = 0, len = ret.length; i < len; i++) {
                                            for (let j = 0, lon = cb.length; j < lon; j++) {
                                                if (ret[i].name == cb[j].name) {
                                                    ret[i].nTag = cb[j].size;
                                                }
                                            }
                                        }
                                        res.contentType('json');
                                        res.send(JSON.stringify(ret));
                                    })
                                })
                            })
                        }
                        else if (req.body.mySort == 4) {
                            getProfile.GetDistance(req.session.user, ret, (ret) => {
                                getProfile.nbTag(req.session.user, ret, (cb) => {
                                    for (let i = 0, len = ret.length; i < len; i++) {
                                        for (let j = 0, lon = cb.length; j < lon; j++) {
                                            if (ret[i].name == cb[j].name) {
                                                ret[i].nTag = cb[j].size;
                                            }
                                        }
                                    }
                                    getProfile.sortByTag(ret, (mcb) => {
                                        res.contentType('json');
                                        res.send(JSON.stringify(mcb));
                                    })
                                })

                            })
                        }
                    });
                });
            });
        });
    }
});

//					POST
router.post('/filter', upload.array(),requireLogin, (req, res) =>{
	var ageMin = req.body.ageMin;
	let ageMax = req.body.ageMax;
	var popMin = req.body.popMin;
	var popMax = req.body.popMax;
	var tag = req.body.tag;
	var dist = req.body.dist;
	if (req.body.data)
	{
		let data = JSON.parse(req.body.data);
		getProfile.SortPrefSexUser(req.session.user, data, (cb)=>{
			getProfile.sortByAge(ageMin, ageMax, cb, (callB)=>{
				getProfile.sortByPop(popMin, popMax, callB, (m_cb)=>{
					getProfile.SortDistance(req.session.user, m_cb, dist, (my_cb)=>{
						getProfile.SortTag(req.session.user, my_cb, tag, (mylastcb)=> {
							getProfile.GetDistance(req.session.user, mylastcb, (geo)=> {
 								res.contentType('json');
								res.send(JSON.stringify(geo));
								});
						});
					});
				});
			});
		});
	}
	else {
		User.Create_db((ret)=> {
            getProfile.findUsers3(req.session.user.name, (resu)=> {
                getProfile.sortReported(ret, resu, (ret) => {
                    getProfile.SortPrefSexUser(req.session.user, ret, (cb) => {
                        getProfile.sortByAge(ageMin, ageMax, cb, (callB) => {
                            getProfile.sortByPop(popMin, popMax, callB, (m_cb) => {
                                getProfile.SortDistance(req.session.user, m_cb, dist, (my_cb) => {
                                    getProfile.SortTag(req.session.user, my_cb, tag, (mylastcb) => {
                                        getProfile.GetDistance(req.session.user, mylastcb, (geo) => {
                                            getProfile.nbTag(req.session.user, geo, (result) => {
                                                for (let i = 0, len = geo.length; i < len; i++) {
                                                    for (let j = 0, lon = result.length; j < lon; j++) {
                                                        if (geo[i].name == result[j].name) {
                                                            geo[i].nTag = result[j].size;
                                                        }
                                                    }
                                                }
                                                res.contentType('json');
                                                return res.send(JSON.stringify(geo));
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
			});
	}
});



module.exports = router;