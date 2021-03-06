
var express = require('express');
let bodyParser = require('body-parser')
var router = express.Router();
var multer = require('multer');
let Utilisateur = require('../models/utilisateur');

router.use(require('../middlewares/flash'));
router.use(bodyParser.urlencoded({extended: false}));

var storage = multer.diskStorage({
	destination: function (req, file, callback){
		callback(null, './public/img');
	},
	filename: function (req, file, callback){

		if (file.mimetype == 'image/png'){
	
		var	path =  file.fieldname + '-' + Date.now() + '.png';
		Utilisateur.uploadImg2(req.user.name, path, (res, err)=>{

				if (err)
					{throw err}
				else{
					req.flash('sucess',"Votre Image est upload")
				}
				
			})

			callback(null, path)
		} else if (file.mimetype == 'image/jpeg'){
			var	path =  file.fieldname + '-' + Date.now() + '.jpg'
			Utilisateur.uploadImg2(req.user.name, path, (res, err)=>{

				if (err)
					{throw err}
				else{
					req.flash('sucess',"Votre Image est upload")
					callback('OOK');
				}
				
			})

			callback(null, path)

		}
		else{
			var err = 'NEED PNG';
			callback(err)
		}
	}
});

var upload = multer({storage : storage}).array('userImg', 5);

function requireLogin (req, res, next) {
  if (!req.user) {
    req.flash('error', "il faut s'autentifier")
    res.redirect('/login');
  } else {
    next();
  }
};

router.get('/', requireLogin, (req, res, next)=>{
	Utilisateur.findUsers3(req.user.name, (result)=>{
		res.render('upload_img', {ret: result, user: result});
	})
})


router.post('/delete_img', (req, resu)=>{
	Utilisateur.deleteIMG(req.user.name, req.body.path , ()=>{
	})
})

router.post('/upload_img', (req, res)=>{

	Utilisateur.findUsers3(req.user.name, (result)=>{
		if (result[0].img.length >=  5){
			req.flash('error', '5 img ...');
			res.redirect('/upload_img')
		} else {
			upload(req, res, function(err){
				 if (err){
					req.flash('error', err);
					res.redirect('/upload_img')
				} else{
					 req.flash('sucess', 'IMG upload');
					 res.redirect('/upload_img')
				}
			})
		}
	})

})

router.post('/change_img', (req, resu, next)=>{
	
	Utilisateur.findUsers3(req.user.name, (res)=>{
		Utilisateur.changeProfilePic(req.user.name, req.body.path, req.body.i, ()=>{
		})
	})

})

module.exports = router;
