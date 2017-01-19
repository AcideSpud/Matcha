$(function () {
 function checkTime(i) {
        return (i < 10) ? "0" + i : i;
    }

    function startTime() {
        var today = new Date(),
            h = checkTime(today.getHours()),
            m = checkTime(today.getMinutes()),
            s = checkTime(today.getSeconds());
        document.getElementById('time').innerHTML = h + ":" + m + ":" + s;
        t = setTimeout(function () {
            startTime()
        }, 500);
    }
    if (document.getElementById('time')){
       startTime();
    }
});

var my_name;
function like_request(name) {
    var xhr = new XMLHttpRequest();
    my_name = name;
    xhr.open("POST", "/profile/like/:" + name, true);
    xhr.send();
    $('#mylikebutton').text('unlike').removeClass('btn-default').addClass('btn-danger').attr("onclick", "unlike_request('" + my_name + "')");
}


function unlike_request(name) {
    var xhr = new XMLHttpRequest();
    my_name = name;
    xhr.open("POST", "/profile/unlike/:" + name, true);
    xhr.send();
    $('#mylikebutton').text('like').removeClass('btn-danger').addClass('btn-primary').attr("onclick", "like_request('" + my_name + "')");

}

function send_info_chat(name1, name2){
    var request = new XMLHttpRequest();
    request.open('POST', '/chat/chat', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send("name1="+name1+"&name2="+name2);
}

function send_info_chat2(chatRoomName, username){
    var request = new XMLHttpRequest();
    request.open('POST', '/chat/chat', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send("crn="+chatRoomName+"&name="+username);
}

function send_info_chat3(chatRoomName, username){
    var request = new XMLHttpRequest();
    request.open('POST', '/chat/chat', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send("crn="+chatRoomName+"&name="+username);
}

function send_info_geo(chatRoomName, username){
    var request = new XMLHttpRequest();
    request.open('POST', '/compte/chat', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send("crn="+chatRoomName+"&name="+username+"&test=test");
}

function    deleteImg(path){
    var request = new XMLHttpRequest();
    request.open('POST', '/upload_img/delete_img', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send("path="+path);
    $("#status").empty().text("Modification ok");
}

function    changeProfilePicture(path, i){
    var request = new XMLHttpRequest();
    request.open('POST', '/upload_img/change_img', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send("path="+path+"&i="+i);
    $("#status").empty().text("Modification ok");
}

function    block_user(userBlock, user){
    var request = new XMLHttpRequest();
    request.open('POST', '/profile/block', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send("block="+userBlock+"&user="+user);

}

function    setNotif(notif){
    var request = new XMLHttpRequest();
    request.open('POST', '/setNotif', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send("notif="+notif);
}
function    reportedEv(name) {
    var request = new XMLHttpRequest();
    request.open('POST', '/profile/reporte/' + name, true);
    request.send();
    $('#reported').text('Alrd Report').prop('onclick',null).off('click').removeClass('btn-warning').addClass('btn-danger');
}