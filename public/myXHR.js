/**
 * Created by tapostin on 10/10/16.
 */


$(function() {

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
    console.log("test");
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

function send_info_chat2(name1, name2){
    var value1 = encodeURIComponent(name1),
    value2 = encodeURIComponent(name2);
    var request = new XMLHttpRequest();
    request.open('GET', '/chat/?name1=' + value1 '?name2=' + value2, true);
    xhr.send(null);
}

