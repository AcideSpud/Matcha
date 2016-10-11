
var express = require('express');
let bodyParser = require('body-parser')
var router = express.Router();
var multer = require('multer');

router.use(require('../middlewares/flash'))

var storage = multer.diskStorage({
	destination: function (req, file, callback){

		console.log('DESTINATION UPLOAD IMG')
		callback(null, './public/img');
	},
	filename: function (req, file, callback){
		console.log('FILENAME UPLOAD IMG')
		let Utilisateur = require('../models/utilisateur');
		var path = file.fieldname + '-' + Date.now();

		Utilisateur.uploadImg(req.user.name, path, (res, err)=>{
			console.log('POURQUOI ca rebtre PAADSss-----')
			if (err) {throw err}
			else{
				console.log('-----UTILISATEUR UPLOADIMG')
				request.flash('success', "Image(s) Upload")
			}
		})
		callback(null, file.fieldname + '-' + Date.now());
		console.log('-------FIN storage')
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
