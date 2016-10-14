
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

		console.log('FILENAME----', file)

//		if (file == undefined)
//		{
//			var err = "PUT A FILE FDP"
//			callback(err)
//		}
		//else{
			if (file.mimetype == 'image/jpeg' ||
			file.mimetype == 'image/png'){
			console.log('FILEEEE MIMETYPE OOOK')
			Utilisateur.uploadImg2(req.user.name, path, (res, err)=>{
				if (err) {throw err}
				else{
				//flash message
				}
			})
			if (file.mimetype == 'image/jpeg') callback(null, file.fieldname + '-' + Date.now()+'.jpg');
			else callback(null, file.fieldname + '-' + Date.now()+'.png')
			}
		else{
			console.log('pas oook')
			var err = 'Not jpg or png'
			callback(err)
			}
		//}
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



	console.log('UPLOAD---', req.files)
	
		upload(req, res, function(err){
			console.log("-----UPLOAD IMG REQFILE" + req.files);
			 if (err){
				return res.end("Error uploading file.");
			}
			else
			 return res.end("file is uploaded")
		})
	
})

module.exports = router;
