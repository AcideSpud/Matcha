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
						res.contentType('json');
						res.send(JSON.stringify(my_cb));
					})
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
						    getProfile.SortTag(req.session.user, my_cb, 2);
							res.contentType('json');
							res.send(JSON.stringify(my_cb));
						});
					});
				});
			});
		});
	}
});

module.exports = router;