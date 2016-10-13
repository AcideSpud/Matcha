let express = require('express');
let bodyParser = require('body-parser');
let router = express.Router()
let nodemailer = require('nodemailer')
let prompt = require('prompt');


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
			var newpass = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";


			Utilisateur.modifPwd(result[0].name, newpass.shuffle(), (err, res)=>{
				if (err) throw err

				var transporter = nodemailer.createTransport({
					service: 'Gmail',
					auth: {
						user:'matcha42matcha@gmail.com',
						pass:'projetmatcha42'
					}
				})
				var mailOptions ={
					from: 'Matcha 42 <matcha42matcha@gmail.com>',
					to: 'rosamond.julien@gmail.com',
					subject: 'forgot mdp',
					text:'vous perdu votre mot de pass?' + result[0].pwd,
					html:'<p>ceci est le contenu html: </p></br>' + result[0].pwd + '</br>changez le pour plus de securites <a href="http://localhost:3000">lien</a></html>' 
				}

				transporter.sendMail(mailOptions, (err, info)=>{
					if (err){
						console.log(err);
	
					}else{
						console.log("----MAIL ENVOYE--:", info.response);
						
					}
				})
			})
		}
	})
	res.redirect('/')
})

module.exports = router;