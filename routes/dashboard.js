let express = require('express');
let router = express.Router();
let multer = require('multer');
let bodyParser = require('body-parser');
var upload = multer();
let User = require('../models/getDataUser');
let getProfile = require('../models/utilisateur');
/* GET home page. */
function requireLogin (req, res, next) {
	if (!req.user) {
		req.flash('error', "il faut s'autentifier")
		res.redirect('/login');
	} else {
		next();
	}
};

function dump(obj) {
	var out = '';
	for (var i in obj) {
		out += i + ": " + obj[i] + "\n";
	}
}
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
//router.use(bodyParser.json());



//					GET
router.get('/', requireLogin, function(req, res, next) {

	User.Create_db((ret)=>{
        getProfile.sortReported(ret, (ret)=>{
		getProfile.SortPrefSexUser(req.session.user, ret, (cb)=> {
            getProfile.GetDistance(req.session.user, cb, (geo)=> {
                res.render('dashboard', {
                    ret: cb,
                    geo: geo
                });
            });
        });
		});
	});

});

router.post('/sort', upload.array(), requireLogin, (req, res)=> {
    if (req.body.data) {
        let data = JSON.parse(req.body.data);
        if (req.body.mySort = 1) {
            getProfile.sortAge(data, (cb)=>{
                res.contentType('json');
                res.send(JSON.stringify(cb));
            });
        }
        else if (req.body.mySort = 2) {
            getProfile.sortPop(data, (cb)=>{
                res.contentType('json');
                res.send(JSON.stringify(cb));
            });
        }
        else if (req.body.mySort = 3) {
            getProfile.GetDistance(req.session.user, data, (cb)=> {
                for (let i = 0, len = data.length; i < len; i++) {
                    data[i].push({geo: cb[i]});
                }
                getProfile.sortDist(data, (cb)=> {
                    res.contentType('json');
                    res.send(JSON.stringify(cb));
                })
            });
        }
        else if (req.body.mySort = 4) {
            getProfile.nbTag(req.session.user, data, (cb)=>{
                for (let i = 0, len = data.length; i < len; i++){
                    for (let j = 0, lon = cb.length; i < lon; j++){
                        if (data[i] == cb[j].name){
                            data[i].push({nTag : cb[j].size});
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
            getProfile.sortReported(array, (array)=>{
            getProfile.SortPrefSexUser(req.session.user, array, (ret)=>{
                if (req.body.mySort = 1) {
                    getProfile.sortAge(ret, (cb)=>{
                        res.contentType('json');
                        res.send(JSON.stringify(cb));
                    });
                }
                else if (req.body.mySort = 2) {
                    getProfile.sortPop(ret, (cb)=>{
                        res.contentType('json');
                        res.send(JSON.stringify(cb));
                    });
                }
                else if (req.body.mySort = 3) {
                    getProfile.GetDistance(req.sessios.user, ret, (cb)=>{
                        for (let i = 0, len = ret.length; i < len; i++){
                            ret[i].push({geo : cb[i]});
                        }
                        getProfile.sortDist(ret , (cb)=>{
                            res.contentType('json');
                            res.send(JSON.stringify(cb));
                        })

                    })
                }
                else if (req.body.mySort = 4) {
                    getProfile.nbTag(req.session.user, ret, (cb)=>{
                        for (let i = 0, len = ret.length; i < len; i++){
                            for (let j = 0, lon = cb.length; i < lon; j++){
                                if (ret[i] == cb[j].name){
                                    ret[i].push({nTag : cb[j].size});
                                }
                            }
                        }
                        getProfile.sortByTag(ret, (mcb)=>{
                            res.contentType('json');
                            res.send(JSON.stringify(mcb));
                        })
                    })
                }
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
								for (let i = 0, len = mylastcb.lentgh; len < i; i++) {
									mylastcb[i].push({geo : geo[i]});
								}
 								res.contentType('json');
								res.send(JSON.stringify(mylastcb));
								});
						});
					});
				});
			});
		});
	}
	else {
		User.Create_db((ret)=> {
            getProfile.sortReported(ret, (ret)=>{
			getProfile.SortPrefSexUser(req.session.user, ret, (cb)=> {
				getProfile.sortByAge(ageMin, ageMax, cb, (callB)=> {
                    getProfile.sortByPop(popMin, popMax, callB, (m_cb)=> {
                        getProfile.SortDistance(req.session.user, m_cb, dist, (my_cb)=> {
                            getProfile.SortTag(req.session.user, my_cb, tag, (mylastcb)=> {
                                getProfile.GetDistance(req.session.user, mylastcb, (geo)=> {
                                    for (let i = 0, len = mylastcb.lentgh; len < i; i++) {
                                        mylastcb[i].push({geo: geo[i]});
                                    }
                                    res.contentType('json');
                                    res.send(JSON.stringify(mylastcb));
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