let express = require('express');
var router = express.Router();
var Utilisateur = require('../models/utilisateur')
var chatRoom = require('../models/chat_function')
let bodyParser = require('body-parser');

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


		Utilisateur.findUsers3(req.session.user.name, (result)=>{

			if (result[0]){
				console.log("ROOMNAME reAD ALL",req.body.roomName)
				if (req.body.roomName){
					chatRoom.readAllMsg2(req.body.roomName, ()=>{
						console.log("ROOMNAME reAD ALL")
					})
				} else if (result[0].focus){
					chatRoom.readAllMsg2(result[0].focus, ()=>{
						console.log("FOCUS reAD ALL")
					})
				}
			}

		})

		if (req.body.name1 &&  req.body.name2){
			console.log('PASSAGE PAR LE PROFILE')
			chatRoom.findChatRoom((req.body.name2 + req.body.name1), (res)=>{
				if (res === undefined)
						chatRoom.createChatroom((req.body.name2 + req.body.name1), ()=>{
							console.log('chatroom created');
				})
				else
					console.log('existe deja')
			})

			Utilisateur.GetDB((db)=>{
				var chatName;

				Utilisateur.findUsers3(req.body.name2, (res)=>{
					if (res){
						for (var i = 0; i<res[0].matchRoom.length; i++){
							if (res[0].matchRoom[i].indexOf(req.body.name1) >= 0){
								chatName = res[0].matchRoom[i];
								break
							}
						}
						Utilisateur.updateMainChatRoom(db, req.body.name2,chatName)
					}	
				})
			})
		}
		else if (req.body.crn && req.body.name){
			console.log('PASSAGE PAR LE FOotEr')

			Utilisateur.GetDB((db)=>{
				Utilisateur.updateMainChatRoom(db, req.body.name, req.body.crn)
			})
		}

		if (req.body.roomName){
			console.log('REQBODYROOMNAME',req.body.userName, req.body.roomName, req.body.content)
			chatRoom.findChatRoom(req.body.roomName, (res)=>{
				if (res){
						chatRoom.modifContent(req.body.roomName, req.body.userName, req.body.content, ()=>{
					})
				}
			})
		}
})

module.exports = router;