/**
 * Created by Tom on 22/10/2016.
 */
$(function() {

});
var getHttpRequest = function () {
    var httpRequest = false;

    if (window.XMLHttpRequest) { // Mozilla, Safari,...
        httpRequest = new XMLHttpRequest();
        if (httpRequest.overrideMimeType) {
            httpRequest.overrideMimeType('text/xml');
        }
    }
    else if (window.ActiveXObject) { // IE
        try {
            httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e) {
            try {
                httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (e) {}
        }
    }

    if (!httpRequest) {
        alert('Abandon :( Impossible de créer une instance XMLHTTP');
        return false;
    }

    return httpRequest
}

var onProgress = function(e) {
    if (e.lengthComputable) {
        var percentComplete = (e.loaded/e.total)*100;
    }
};

var data = null;
var xhr = getHttpRequest();

function showTable(data){
    for (mkey in data) {

        $('#table').append('<div class="col-sm-6 col-md-3" id="thebox">' +
       '<div class="thumbnail" style="background-image:linear-gradient(90deg,rgb(127, 18, 47), rgb(200, 255, 255) );" id="mybox">' +
         '<img class="parent" src="'+ data[mkey].img[0]+ '"  alt="">' +
            '<div class="caption">' + '<h3>' + data[mkey].nom + data[mkey].prenom +'</h3>' +
            '<p id="test">'+ data[mkey].bio +'...</p>'+
            '<p id="b_view"><a href="#" class="btn btn-primary" role="button">Like</a> <a href="/profile/' + data[mkey].name + '" class="btn btn-default" role="button">View profil</a></p>' +
                '</div></div></div>');

    }

};

var onReady = function(e) {
    // ready state
    var status;
    // https://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate
    if (xhr.readyState == 4) { // `DONE`
        status = xhr.status;
        if (status == 200) {
            data = JSON.parse(xhr.responseText);
            showTable(data);
        } else {
            console.log(status);
        }
    }
    console.log("good");
};

var onError = function(err) {
    // something went wrong with upload
};

function find(sort){
    if (!sort) {
        if (data) {
            console.log("MYSUPERDUPERTEST !!!!");
        }
        var ageMin = $('#age-min').val();
        var ageMax = $('#age-max').val();
        var popMin = $('#pop-min').val();
        var popMax = $('#pop-max').val();
        var mDist = $('#dist').val();
        var tag = $('#sel1').val();

        $('#table').empty();


        var myform = new FormData();
        myform.append("ageMin", ageMin);
        myform.append("ageMax", ageMax);
        myform.append("popMin", popMin);
        myform.append("popMax", popMax);
        myform.append("tag", tag);
        myform.append("dist", mDist);

        if (data) {
            myform.append('data', JSON.stringify(data));
            console.log(myform.data + "HAHHAHAHAHAHHA");
        }

        console.log(myform);
        for (var pair of myform.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }


        xhr.open('POST', "/dashboard/filter", true);
        xhr.setRequestHeader('X-Requested-With', 'xmlhttprequest');
        xhr.addEventListener('error', onError, false);
        xhr.addEventListener('progress', onProgress, false);
        xhr.send(myform);
        xhr.addEventListener('readystatechange', onReady, false);
    }
    else {
        var sortForm = new FormData();
        var mySort = $('#sel2').val();
        sortForm.append("mySort", mySort);
        if (data) {
            sortForm.append('data', JSON.stringify(data));
            console.log(myform.data + "HAHHAHAHAHAHHA");
        }

        xhr.open('POST', "/dashboard/sort", true);
        xhr.setRequestHeader('X-Requested-With', 'xmlhttprequest');
        xhr.addEventListener('error', onError, false);
        xhr.addEventListener('progress', onProgress, false);
        xhr.send(sortForm);
        xhr.addEventListener('readystatechange', onReady, false);
    }
}