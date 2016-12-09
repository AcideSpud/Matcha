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
let timeAgo = require('node-time-ago');
let async = require('async')
var sanitizeHtml = require('sanitize-html');

let routes = require('./routes/index');
let users = require('./routes/users');
let inscription2 = require('./routes/inscription2');
let compte = require('./routes/compte');
let dashboard = require('./routes/dashboard');
let profile = require('./routes/profile');
let myprofile = require('./routes/myprofile');
let login = require('./routes/login');
let upload_img = require('./routes/upload_img');
let forgot_mail = require('./routes/forgot_mail');
let logout = require('./routes/logout');
let chat = require('./routes/chat');
let header = require('./routes/header');



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



var all_users = {};
var rooms = ['room1', 'room2', 'room3'];
var chatRoom = [];
var historique_message =[];
var likeLength = 0;
var matchLength = 0;
var visitLength = 0;
var messageLength = 0;

var Utilisateur = require('./models/utilisateur.js');
var chatRoom = require('./models/chat_function')

io.on('connection', function (socket) {
  
socket.on('sendchat', function(data){
  var clean = sanitizeHtml(data);
    socket.emit(socket.room).emit('updatechat', socket.username, clean);
    io.sockets.in(socket.room).emit('afficher_message', socket.username, clean);
  });

    let info = 0;

  socket.on('notification_like', function(data) {
      Utilisateur.findUsers3(data, (res)=> {
        if (res[0]){
          var allVisit = [];
          var allNotif = [];

          Utilisateur.checkNbNotif(res[0].name, (cb)=> {
            socket.emit('nb_notif_unread', cb);

          });
          if (res[0].liker){
            socket.emit('notif_all_like', res[0].liker);
          }
          if (res[0].visit){
            for (var i = 0; i < res[0].visit.length; i++){
              if (allVisit.indexOf(res[0].visit[i].user) === -1){
               allVisit.push(res[0].visit[i].user)
              }
            }
            socket.emit('notif_all_visit', allVisit);
          }
          if (res[0].notif){
            for (let j = 0; j < res[0].notif.length; j++){
              if (allNotif.indexOf(res[0].notif[j].userSend) === -1){
               res[0].notif[j].date = timeAgo(res[0].notif[j].date);
               allNotif.push(res[0].notif[j])
             }  
            }
            socket.emit('notif_like', allNotif)
          }
        }
      });
  });

  socket.on('notification_newMsg_unread', function(data){
    Utilisateur.findUsers3(data, (res)=>{
      if (res){
        for(var i = 0; i<res[0].matchRoom.length; i++){
          chatRoom.findChatRoom(res[0].matchRoom[i], (chat)=>{
            if(chat){
              chatRoom.checkNbNotif(chat[0].chatRoomName, res[0].name, (nb)=>{
                socket.emit('nb_msg_unread', nb)
              })
            }
          })
        }
      }
    })
  })

  socket.on('notification_newMsg', function(data){
    var allMsg = [];

    Utilisateur.findUsers3(data, (res)=>{
      if (res){
        for(var i = 0; i<res[0].matchRoom.length; i++){
          chatRoom.findChatRoom(res[0].matchRoom[i], (chat)=>{
            if (chat && chat[0].conte){
              for(var i =0; i<chat[0].conte.length; i++){
                if((chat[0].conte[i].user != res[0].name) && (chat[0].conte[i].isRead == false)){
                  allMsg.push(chat[0].conte[i])
                } 
              }
              socket.emit('notif_newMsg', allMsg, chat[0].chatRoomName)
            }    
          })
        }
      }
    })
  })

  socket.on('disconnect', function(){
    delete all_users[socket.username];
    io.sockets.emit('updateusers', all_users);
    socket.leave(socket.room);
  });

  socket.on('adduser3', function(username, chatRoomName){

    var chat = require('./models/chat_function.js');
    var allChatRoom = new Array();
    socket.username = username;

    async.series({
      one: function(callback) {
          chat.findAllRooms((res)=>{
            for (var i = 0; i<res.length; i++)
            allChatRoom[i] = res[i].chatRoomName;
            return callback(null, 'find all rooms ok');
        })
      },
      two: function(callback){
        chat.findChatRoom(chatRoomName, (res)=>{
          if (res && res[0].conte){
            for (var i = 0; i < res[0].conte.length; i++){
                socket.emit('oldMess', res[0].conte[i].user, res[0].conte[i].content, res[0].conte[i].date) 
            }
            return callback(null, 'emit old mess ok')
          } 
        })
      }
    }, function(err, results) {
      socket.username = username;
      socket.room = chatRoomName;
      all_users[username] = username;
      socket.join(chatRoomName);
    });
  })
});

app.post('/setNotif', (req, res)=>{
    console.log("RECEVE POST SETNOTIF !!!!!")
    Utilisateur.findUsers3(req.session.user.name, (cb)=>{
      /*Utilisateur.updateNotif(cb);*/
      res.end;
    });

});

app.use(require('./middlewares/flash'));
app.use('/', routes);
app.use('/inscription2', inscription2);
app.use('/users', users);
app.use('/login', login);
app.use('/dashboard', dashboard);
app.use('/compte', compte);
app.use('/profile', profile);
app.use('/myprofile', myprofile);
app.use('/chat', chat);
app.use('/upload_img', upload_img);
app.use('/header', header);
app.use('/forgot_mail', forgot_mail);
app.use('/logout', logout);

/*
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
});*/


module.exports = app;