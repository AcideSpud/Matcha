let express = require('express');
let bodyParser = require('body-parser');
let router = express.Router()
let nodemailer = require('nodemailer')
let prompt = require('prompt');
let bcrypt = require('bcryptjs')


String.prototype.shuffle = function (){
	 var a = this.split(""),
        n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
}

router.use(bodyParser.urlencoded({ extended: false }));
router.use(require('../middlewares/flash'));

router.get('/', (req, res, next)=>{
	res.render('forgot_mail')
})

router.post('/forgot_mail', (req, res)=>{
	let Utilisateur = require('../models/utilisateur')
	

	Utilisateur.queryUserByMail(req.body.email, (result, err)=>{
		if (err) throw err
		else if (result){
			var newpass = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".shuffle();
			var hash = bcrypt.hashSync(newpass);

			Utilisateur.modifPwd(result[0].name, hash, (err, res)=>{
				if (err) throw err

				var transporter = nodemailer.createTransport({
					service: 'Gmail',
					auth: {
						user:'matcha42matcha@gmail.com',
						pass:'projetmatcha42'
					}
				})

				var textLink = "http://" + req.headers.host;

				var mailOptions ={
					from: 'Matcha 42 <matcha42matcha@gmail.com>',
					to: req.body.email,
					subject: 'forgot mdp',
					generateTextFromHTML: true,
					html:'<p>votre nouveau pwd: </p></br>' + newpass + '</br><a href=\"'+ textLink.toString() + '\"> </br>Click here to activate your account.</a>'
				}

				transporter.sendMail(mailOptions, (err, info)=>{
					if (err){
					}else{		
					}
				})
			})
		}
	})
	req.flash('sucess', 'Nous vous avons envoyé un nouveau pwd')
	res.redirect('/')
})

module.exports = router;