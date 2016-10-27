let express = require('express');
let path = require('path');
let http = require('http');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let routes = require('./routes/index');
let users = require('./routes/users');
let inscription = require('./routes/inscription');
let compte = require('./routes/compte');
let dashboard = require('./routes/dashboard');
let profile = require('./routes/profile');
let login = require('./routes/login');
let upload_img = require('./routes/upload_img');
let forgot_mail = require('./routes/forgot_mail');
let logout = require('./routes/logout')
//let socket = require('./routes/socket')

let session = require('express-session');
let app = express();
let server = http.Server(app);
var io = require('socket.io').listen(server);

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//init chat

//io.sockets.on('connection', function (socket) 
//	console.log('client connect');
//	socket.on('echo', function (data) {
	//	io.sockets.emit('message', data);
	//);
//});
//require('./routes/chat')(app,io);


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//INIT_SESSION
app.use(session({
	secret: process.env.SESSION_SECRET || 'secret',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }
}))


app.use(function(req, res, next){
  if (req.session && req.session.user){
    let Utilisateur = require('./models/utilisateur')
    Utilisateur.findUsers3(req.session.user.name, (result, err)=>{
      if (err){
        console.log(err)
      }else{
        if (result[0])
        {
          req.user = result[0];
          delete req.user.pwd;
          req.session.user = result[0];
          res.locals.user = result[0];

        } else{

        }
        next();
      }
    })
  } else{
    next();
  }
})

function requireLogin (req, res, next) {
  if (!req.user) {
    req.flash('error', "il faut s'autentifier")
    res.redirect('/login');
  } else {
    next();
  }
};


//ROUTAGE
app.use(require('./middlewares/flash'));
app.use('/inscription', inscription);
app.use('/', routes);
app.use('/users', users);
//app.use('/chat', chat);
app.use('/login', login);
app.use('/dashboard', dashboard);
app.use('/compte', compte);
app.use('/profile', profile);
app.use('/upload_img', upload_img);
app.use('/forgot_mail', forgot_mail);
app.use('/logout', logout);



//port
app.listen(3000, function () {
  
  console.log('app listening on port 3000!');
});



module.exports = app;