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
    	res.render('chat2', {ret : result});
  })
});


router.post('/chat', requireLogin, function(req, res, next){


		if (req.body.name1 &&  req.body.name2){

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

				console.log('-'+ req.body.name2 + req.body.name1+ '-')
				Utilisateur.findUsers3(req.body.name2, (res)=>{
					if (res[0]){
						console.log(req.body.name1);
						console.log(res[0].matchRoom.indexOf(req.body.name1))
						console.log(res[0].matchRoom);
						for (var i = 0; i<res[0].matchRoom.length; i++){
							if (res[0].matchRoom[i].indexOf(req.body.name1) == 0){
							chatName = res[0].matchRoom[i];
							break
							console.log('----' + chatName + '---')
							}
						}
						Utilisateur.updateMainChatRoom(db, req.body.name2,chatName)
					}	
				})
			})
		}

		if (req.body.roomName){
			chatRoom.findChatRoom(req.body.roomName, (res)=>{
			if (res)
				chatRoom.modifContent(req.body.roomName, req.body.userName, req.body.content, ()=>{
				})
		})
		}
})

module.exports = router;