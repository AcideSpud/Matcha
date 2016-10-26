/**
 * Created by Tom on 22/10/2016.
 */
$(function() {
    $('#datbox').hide();
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

var onReady = function(e) {
    // ready state
    $.ajax({
        type: "POST",
        url: "http://localhost:3000/dashboard/filter",
        success: function (data) {
            for (var pair of data.entries()) {
                console.log(pair[0]+ ', ' + pair[1]);
            }
        },
        error: function () {
            alert('error')
        }
    })
    console.log("good");
};

var onError = function(err) {
    // something went wrong with upload
};

function find(){
    var ageMin = $('#age-min').val();
    var ageMax = $('#age-max').val();
    var popMin = $('#pop-min').val();
    var popMax = $('#pop-max').val();
    var mDist = $('#dist').val();



    var myform = new FormData();
    myform.append("ageMin" , ageMin);
    myform.append("ageMax" , ageMax);
    myform.append("popMin" , popMin);
    myform.append("popMax" , popMax);
    myform.append("dist" , mDist);

    console.log(myform);
    for (var pair of myform.entries()) {
        console.log(pair[0]+ ', ' + pair[1]);
    }
    $('#datbox').hide();
    var xhr = getHttpRequest();
    xhr.open('POST', "/dashboard/filter", true);
    xhr.setRequestHeader('X-Requested-With', 'xmlhttprequest');
    xhr.addEventListener('error', onError, false);
    xhr.addEventListener('progress', onProgress, false);
    xhr.send(myform);
    xhr.addEventListener('readystatechange', onReady, false);

}