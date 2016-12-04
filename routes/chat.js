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
			console.log('PAR PrOFILE' + req.body.name2 + req.body.name1)
			chatRoom.findChatRoom((req.body.name2 + req.body.name1), (res)=>{
				if (res === undefined)
						chatRoom.createChatroom((req.body.name2 + req.body.name1), ()=>{
				})
				else
					console.log('existe deja')
			})

			Utilisateur.GetDB((db)=>{
				var chatName;
				console.log('reewqq', req.body.name1)
				Utilisateur.findUsers3(req.body.name2, (res)=>{
					console.log('sapjfpisadfpisdfj', res[0])
					if (res){
						console.log('coucoucouco')
						for (var i = 0; i<res[0].matchRoom.length; i++){
							console.log('reewqq', req.body.name1)
							if (res[0].matchRoom[i].indexOf(req.body.name1) >= 0){
								chatName = res[0].matchRoom[i];
								break
							}
						}
						console.log('coucou1')
						Utilisateur.updateMainChatRoom(db, req.body.name2,chatName)
					}	
				})
			})
		}
		else if (req.body.crn && req.body.name){
			console.log('PAR FOOTER')
			Utilisateur.GetDB((db)=>{
				console.log('coucou2')
				Utilisateur.updateMainChatRoom(db, req.body.name, req.body.crn)
			})
		}


	/*	Utilisateur.findUsers3(req.session.user.name, (result)=>{
			if (result[0]){
				if (req.body.roomName){
					var autre = req.body.roomName.replace(result[0].name, "");
					chatRoom.readAllMsg2(req.body.roomName, autre, ()=>{
					})
				} else if (result[0].focus){
					var autre = result[0].focus.replace(result[0].name, "");
					chatRoom.readAllMsg2(result[0].focus, autre,  ()=>{
					})
				}
			}
		})*/

		

		if (req.body.roomName){
			chatRoom.findChatRoom(req.body.roomName, (res)=>{
				if (res){
					var clean = sanitizeHtml(req.body.content);
						console.log(req.body.content)
						console.log('---'+ clean);
						chatRoom.modifContent(req.body.roomName, req.body.userName, clean, ()=>{
					})
				}
			})
		}
})

module.exports = router;