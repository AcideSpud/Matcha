
notif();
var myVar = setInterval(notif, 7000);


/*function sendNotif(){
	console.log('coucou otb')
	notif();
  	var myVar = setInterval(notif, 7000);
}
  */

function notif(user){
    var socket = io.connect('http://localhost:3000');

    socket.on('connect', function(){
    	console.log('coucou')
        socket.emit('notification_like', user);
        socket.emit('notification_newMsg', user);
        socket.emit('notification_newMsg_unread', user);
        socket.on('notif_like', (res, img)=>{
            $('#notifliking').empty();
            for(var i = 0; i < res.length; i++){
                if (res[i].isRead == false) {
                    $('#notifliking').prepend('<li><a onclick="setNotif(\'' + res[i].date + '\');" class="dropdown-item"> <strong><i>' + res[i].type + '</i> ' + res[i].userSend + ' </strong> <p>' + res[i].time + '</p></a></li>');
                } else {
                    $('#notifliking').prepend('<li ><a style="color: antiquewhite" onclick="setNotif(\'' + res[i].date + '\');" class="dropdown-item"> <strong><i>' + res[i].type + '</i> ' + res[i].userSend + ' </strong> <p>' + res[i].time + '</p></a></li>');
                }
            }
        })
        socket.on('notif_all_like', (res)=>{
            $('#all_like').empty();
            for(var i = 0; i < res.length; i++){
                $('#all_like').prepend('<li><a class="dropdown-item" href="/profile/'+res[i]+'"> <strong>'+ res[i] +' </strong></a></li>');
            }
        }) 
        socket.on('notif_all_visit', (res)=>{
            $('#all_visit').empty();
            for(var i = 0; i < res.length; i++){
                $('#all_visit').prepend('<li><a class="dropdown-item" href="/profile/'+res[i]+'"> <strong>'+ res[i] + ' </strong></a></li>');  
            }
        }) 
        socket.on('nb_msg_unread', (res)=>{
            $('#notif_msg_nb').text(res);
        })
        socket.on('nb_notif_unread', (res)=>{
            $('#notif_nb').text(res);
        }) 
        socket.on('notif_newMsg', (res, crn)=>{
            $('#notif_msg').empty();
            for(var i = 0; i < res.length; i++){
                $('#notif_msg').prepend('<li><a class="dropdown-item" href="/chat" onclick="send_info_chat3(\''+ res[i].chatRoomName +'\', \'<%= user[0].name %>\');"><strong>' + res[i].user + '</strong>: le ' + res[i].date  +'</a></li>');
            }
        })
        socket.on('notif_all_conv', (res)=>{
            $('#all_conv').empty();
            for(var i = 0; i < res.length; i++){
                $('#all_conv').prepend('<li><a class="dropdown-item" href="/chat" onclick="send_info_chat3(\''+ res[i].chatRoomName +'\', \'<%= user[0].name %>\');"><strong>' + res[i].other + '-' + res[i].me + '</strong></a></li>');
            }
        })
    })
}