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
    	res.render('chat2', {ret : result, user: result});
  })
});


router.post('/chat', requireLogin, function(req, res, next){


	console.log('chat', req.body.crn);

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
					if (res){
						console.log(req.body.name1);
						console.log('index---oOF:',res[0].matchRoom[0].indexOf(req.body.name1))
						console.log(res[0].matchRoom);
						for (var i = 0; i<res[0].matchRoom.length; i++){
							console.log('matchroom[i]', res[0].matchRoom[i]);
							if (res[0].matchRoom[i].indexOf(req.body.name1) >= 0){

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
		else if (req.body.crn && req.body.name){

			Utilisateur.GetDB((db)=>{
				console.log('coucou chat footer:', req.body.name, req.body.crn)
				Utilisateur.updateMainChatRoom(db, req.body.name, req.body.crn)
			})
		}


		console.log('CHATSerVer:::', req.body.roomName)

		if (req.body.roomName){
			chatRoom.findChatRoom(req.body.roomName, (res)=>{
			if (res)
				chatRoom.modifContent(req.body.roomName, req.body.userName, req.body.content, ()=>{
				})
			})
		}
})

module.exports = router;