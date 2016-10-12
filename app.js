let express = require('express');
let path = require('path');
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
let session = require('express-session');
let app = express();


//app.use(require('./middlewares/flash'));
//connection to db
let i_db = require('./routes/db');
i_db();
//let my_db = require('./routes/db');
//my_db();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//init chat
/*var io = require('socket.io').listen(app.listen(3000));
io.sockets.on('connection', function (socket) 
	console.log('client connect');
	socket.on('echo', function (data) {
		io.sockets.emit('message', data);
	});
});
require('./routes/chat')(app,io);
*/

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

app.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});


app.use(function(req, res, next){
  if (req.session && req.session.user){
    let Utilisateur = require('./models/utilisateur')
    Utilisateur.findUsers3(req.session.user.name, (result, err)=>{
      console.log('BIEN CONNECTE')
      if (err){
        console.log(err)
      }else{
        if (result[0])
        {
          req.user = result[0];
          console.log("-----REQUEST-USER:", req.user)
          delete req.user.pwd;
          req.session.user = result[0];
          res.locals.user = result[0];

        } else{

        }
        next();
      }
    })
  } else{
    console.log('non log')
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







//port
app.listen(3000, function () {
  console.log('app listening on port 3000!');
});

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', 
    message: err.message,
    error: {}
  });
});
*/

module.exports = app;