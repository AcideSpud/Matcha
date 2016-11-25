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
//let inscription = require('./routes/inscription');
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
  console.log('SENDCHAT:::', socket.username)
    io.sockets.in(socket.room).emit('updatechat', socket.username, data);
  });


  socket.on('notification_like', function(data){
      console.log("");
    Utilisateur.findUsers3(data, (res)=>{
      if (res && res[0].liker){
            if (res[0].liker.length > likeLength){
              console.log('liker DATABASE:' + res[0].liker.length)
              console.log('liker ARRAY:' + likeLength)
              console.log('ON TA LIKER');
              
              likeLength = res[0].liker.length;
              socket.emit('notif_like', res);
            } else if (res[0].liker.length < likeLength){
              console.log('ON TA DELIKER');
              
              likeLength = res[0].liker.length;
              socket.emit('notif_unlike', res);
            }
        console.log(likeLength)
      }
      else console.log('NO USER (NOTIFICATION')
    })
  })

  socket.on('notification_match', function(data){
    Utilisateur.findUsers3(data, (res)=>{

      if (res){
        if (res[0].matchRoom.length > matchLength){
          console.log('ON TA MATCHH');
          matchLength = res[0].matchRoom.length;
        }
      }
    })
  });

  socket.on('notification_visit', function(data){
    Utilisateur.findUsers3(data, (res)=>{
      if (res){
        if (res[0].visit.length > visitLength){
          console.log('ON TA VISITER');
          visitLength = res[0].visit.length;

        }
      }
    })
  });

  socket.on('notification_newMsg', function(data){
    console.log('noootif: - ', data)
    var nb_matchRoom;

    Utilisateur.findUsers3(data, (res)=>{
      nb_matchRoom = res[0].matchRoom.length;
      if (res){
        for(var i = 0; i<res[0].matchRoom.length; i++){
          chatRoom.findChatRoom(res[0].matchRoom[i], (chat)=>{
            console.log('FIND CHAT ROOM NOTIF NEW MSG')
            if (chat[0]){
              console.log('CHAT CONtent LENGth:', chat[0].content.length, "messageLength: ", messageLength);
              if(chat[0].content.length > messageLength){
                console.log('FIND CHAT ROOM NOTIF NEW MSG3')
                socket.emit('notif_newMsg', chat[0])
                messageLength = chat[0].content.length;
              }
            }
            })
          }
        }
      })
    })


  socket.on('adduser2', function(username, chatRoomName){
    var chat = require('./models/chat_function.js');
    var allChatRoom = new Array();
    socket.username = username;

    console.log('----CHat ROOM NAME'+ '-' + chatRoomName + '-');
    console.log('----USERNAME'+ '-' + username + '-');

    chat.findAllRooms((res)=>{
      for (var i = 0; i<res.length; i++)
        allChatRoom[i] = res[i].chatRoomName
    })


    chat.findChatRoom(chatRoomName, (res)=>{
      if (res){
        for (var i = 0; i < res[0].userNames.length; i++){
            socket.emit('oldMess', res[0].userNames[i], res[0].content[i])
        }
      }        
    })
    
    socket.username = username;
    socket.room = chatRoomName;
    all_users[username] = username;
    socket.join(chatRoomName);
  })

  socket.on('disconnect', function(){
    delete all_users[socket.username];
    io.sockets.emit('updateusers', all_users);
   // socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
    socket.leave(socket.room);
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