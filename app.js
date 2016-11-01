let express = require('express');
let http = require('http');
let app = express();
var server = http.createServer(app).listen(3000);
var io = require('socket.io').listen(server);

let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let session = require('express-session');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

let routes = require('./routes/index');
let users = require('./routes/users');
let inscription = require('./routes/inscription');
let inscription2 = require('./routes/inscription2');
let compte = require('./routes/compte');
let dashboard = require('./routes/dashboard');
let profile = require('./routes/profile');
let login = require('./routes/login');
let upload_img = require('./routes/upload_img');
let forgot_mail = require('./routes/forgot_mail');
let logout = require('./routes/logout');
let chat = require('./routes/chat');









app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


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


io.sockets.on('connection', function (socket) {
  console.log('nouveau utilisateur')

  socket.on('message', function (message){
    console.log(message);
   // console.log("----USER_INFO--",user_info);
    
  });
});

app.use(require('./middlewares/flash'));
app.use('/', routes);
app.use('/inscription', inscription);
app.use('/inscription2', inscription2);
app.use('/users', users);
app.use('/login', login);
app.use('/dashboard', dashboard);
app.use('/compte', compte);
app.use('/profile', profile);
app.use('/chat', chat);
app.use('/upload_img', upload_img);
app.use('/forgot_mail', forgot_mail);
app.use('/logout', logout);


// handling 404 errors
app.get('*', function(req, res, next) {
  var err = new Error();
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  if(err.status !== 404) {
    return next();
  }
  res.status(404);
  res.render('page_error')
});


module.exports = app;