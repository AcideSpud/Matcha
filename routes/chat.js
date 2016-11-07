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

	chatRoom.createChatroom('coucou', ()=>{
		chatRoom.findChatRoom('coucou', (res)=>{
			console.log(res[0].name)
		})
	})

	Utilisateur.findUsers3(req.user.name, (result)=>{
    	res.render('chat2', {ret : result});
  })
});


router.post('/chat', requireLogin, function(req, res, next){

	console.log(req.body.userName, req.body.content);

})

module.exports = router;