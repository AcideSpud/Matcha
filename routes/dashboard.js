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

	console.log(out);

}
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
//router.use(bodyParser.json());



//					GET
router.get('/', requireLogin, function(req, res, next) {

	User.Create_db((ret)=>{
		getProfile.SortPrefSexUser(req.session.user, ret, (cb)=>{
			getProfile.GetDistance(req.session.user, cb, (geo)=> {
				console.log(cb);
				console.log(geo);
				res.render('dashboard', {ret: cb,
										geo: geo});
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

        }
        else if (req.body.mySort = 4) {

        }
    }
    else {
        User.Create_db((array)=> {
            let ret = [];
            let cmp = 0;
            for (let i = 0, len = array.length; i < len; i++) {
                if (array[i].name != req.session.user.name){
                    ret[cmp] = array[i];
                    cmp++;
                }
            }
            console.log(req.session.user.name);
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

            }
            else if (req.body.mySort = 4) {

            }
        });
    }
});

//					POST
router.post('/filter', upload.array(),requireLogin, (req, res) =>{

	console.log(req.body.ageMin + "BLABLABLAB!");
	var ageMin = req.body.ageMin;
	let ageMax = req.body.ageMax;
	var popMin = req.body.popMin;
	var popMax = req.body.popMax;
	var tag = req.body.tag;
	var dist = req.body.dist;
	if (req.body.data)
	{
		let data = JSON.parse(req.body.data);
		console.log(data[0].name);
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
		console.log(ageMin);
		User.Create_db((ret)=> {
			getProfile.SortPrefSexUser(req.session.user, ret, (cb)=> {
				getProfile.sortByAge(ageMin, ageMax, cb, (callB)=> {
					getProfile.sortByPop(popMin, popMax, callB, (m_cb)=> {
						getProfile.SortDistance(req.session.user, m_cb, dist, (my_cb)=>{
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
	}
});



module.exports = router;