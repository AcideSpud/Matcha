
var express = require('express');
let bodyParser = require('body-parser')
var router = express.Router();
var multer = require('multer');

router.use(require('../middlewares/flash'))

var storage = multer.diskStorage({
	destination: function (req, file, callback){
		callback(null, './public/img');
	},
	filename: function (req, file, callback){
		let Utilisateur = require('../models/utilisateur');
		var path = file.fieldname + '-' + Date.now();

		Utilisateur.uploadImg2(req.user.name, path, (res, err)=>{
			if (err) {throw err}
			else{
			//flash message
			}
		})
		callback(null, file.fieldname + '-' + Date.now());
	}
});

var upload = multer({storage : storage}).array('userImg', 2);

function requireLogin (req, res, next) {
  if (!req.user) {
    req.flash('error', "il faut s'autentifier")
    res.redirect('/login');
  } else {
    next();
  }
};

router.get('/', requireLogin, (req, res, next)=>{
	console.log('IMG a bien ete upload');
	res.render('upload_img');
})

router.use(bodyParser.urlencoded({extended: false}));

router.post('/upload_img', (req, res)=>{
	upload(req, res, function(err){
		console.log("-----UPLOAD IMG REQFILE" + req.files);
		if (err){
			return res.end("Error uploading file.");
		}
		res.end("file is uploaded")
	})
})

module.exports = router;