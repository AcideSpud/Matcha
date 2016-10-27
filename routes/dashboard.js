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
			res.render('dashboard', {ret : cb});
		})
	});

});


//					POST
router.post('/filter', upload.array(),requireLogin, (req, res) =>{

	console.log(req.body.ageMin + "BLABLABLAB!");
	var ageMin = req.body.ageMin;
	let ageMax = req.body.ageMax;
	var popMin = req.body.popMin;
	var popMax = req.body.popMax;
	var dist = req.body.dist;
	console.log(ageMin);
	User.Create_db((ret)=>{
		getProfile.SortPrefSexUser(req.session.user, ret, (cb)=>{
			getProfile.sortByAge(ageMin, ageMax, cb, (callB)=>{
				getProfile.sortByPop(popMin, popMax, callB, (m_cb)=>{
					res.end()
					//res.json(JSON.stringify(m_cb));
				});
			});
		});
	});
});

module.exports = router;