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
				Utilisateur.updateMainChatRoom(db, req.body.name2, (req.body.name2 + req.body.name1))
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