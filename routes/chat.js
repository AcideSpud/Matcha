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

	
		chatRoom.findChatRoom('test', (res)=>{
			if (res === undefined)
				chatRoom.createChatroom('test', ()=>{
					console.log('chatroom created');
		})
			else
				console.log('existe deja')
	})
	
		if (req.body.userName == undefined)
			req.body.userName == '';
		if (req.body.content == undefined)
			req.body.content == '';


console.log("chhhhhhaaaaat",req.body.userName, req.body.content);
		chatRoom.findChatRoom('test', (res)=>{
			if (res)
				chatRoom.modifContent('test', req.body.userName, req.body.content, ()=>{
					console.log('TEST UPDATE CHAT');
				})
		})


	
	

})

module.exports = router;