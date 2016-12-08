let express = require('express');
var router = express.Router();
var Utilisateur = require('../models/utilisateur')
var chatRoom = require('../models/chat_function')
let bodyParser = require('body-parser');
var sanitizeHtml = require('sanitize-html');

router.use(bodyParser.urlencoded({ extended: false }));

function requireLogin (req, res, next) {
	if (!req.user) {
		req.flash('error', "il faut s'autentifier")
		res.redirect('/login');
	} else {
		next();
	}
};



router.get('/', requireLogin,  function(req, res, next) {

	Utilisateur.findUsers3(req.user.name, (result)=>{
		if (result[0]){
			res.render('chat2', {ret : result, user: result});
		}	
 	})
});


router.post('/chat', requireLogin, function(req, res, next){

		if (req.body.name1 &&  req.body.name2){
			console.log('ON ENtre PAR LE PROFILE: SON NOM:', req.body.name1, 'MON NOM:', req.body.name2)
			Utilisateur.GetDB((db)=>{
				Utilisateur.updateMainChatRoom(db, req.body.name2,req.body.name1, null)
			})
		}
		else if (req.body.crn && req.body.name){
			console.log('ON ENtre PAR LE FOOTER: CRN:', req.body.crn, 'NAME:', req.body.name)
			Utilisateur.GetDB((db)=>{
				Utilisateur.updateMainChatRoom(db, req.body.name, null, req.body.crn)
			})
		}

		console.log('req.body.roomName: ----', req.body.roomName);
		if (req.body.roomName){
			chatRoom.findChatRoom(req.body.roomName, (res)=>{
				if (res){
					var clean = sanitizeHtml(req.body.content);
						chatRoom.modifContent(req.body.roomName, req.body.userName, clean, ()=>{
					})
				}
			})
		}
		
		console.log('CRN PUtin:', req.session.user.name);
		console.log('test:', req.body.test)

		Utilisateur.findUsers3(req.session.user.name, (result)=>{
			console.log('PUTINNNNNN______', req.body.crn)
			if (result[0]){
				if (req.body.roomName){
					console.log('PUTIN CA fais quoi')
					chatRoom.readAllMsg2(req.body.roomName, req.session.user.name, ()=>{
						console.log('readAllMsg2 by roomName');
					})
				} else if (result[0].focus){
					console.log('PUTIN CA FAIS QUOI')
					chatRoom.readAllMsg2(result[0].focus, req.session.user.name,  ()=>{
						console.log('readAllMsg2 by focus');
					})
				} else if(req.body.crn){
					console.log('PUTIN CA fais quoi 333')
					chatRoom.readAllMsg2(req.body.crn, req.session.user.name, ()=>{
						console.log('readAllMsg2 by roomName');
					})
				}
			}
		})
})

module.exports = router;