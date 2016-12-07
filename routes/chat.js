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
			Utilisateur.GetDB((db)=>{
				Utilisateur.updateMainChatRoom(db, req.body.name2,req.body.name1)
			})
		}
		else if (req.body.crn && req.body.name){
			Utilisateur.GetDB((db)=>{
				Utilisateur.updateMainChatRoom(db, req.body.name, req.body.crn)
			})
		}

		if (req.body.roomName){
			chatRoom.findChatRoom(req.body.roomName, (res)=>{
				if (res){
					var clean = sanitizeHtml(req.body.content);
						chatRoom.modifContent(req.body.roomName, req.body.userName, clean, ()=>{
					})
				}
			})
		}
		
		Utilisateur.findUsers3(req.session.user.name, (result)=>{
			if (result[0]){
				if (req.body.roomName){
					chatRoom.readAllsMsg2(req.body.roomName, req.session.user.name, ()=>{
					})
				} else if (result[0].focus){
					chatRoom.readAllMsg2(result[0].focus, req.session.user.name,  ()=>{
					})
				}
			}
		})
})

module.exports = router;