let express = require('express');
let app = express();
let router = express.Router();
let http = require('http');
let server = http.createServer(app);
var io = require('socket.io').listen(server);

router.get('/', function(req, res, next) {
	res.render('index2')

});

module.exports = router;