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
    let age = null;
    let orient = null;
    let img = null;
    let imgclass = null;
    for (let i = 0; i < data.length; i++) {
        if (data[i].age)
            age = data[i].age;
        else
            age = 'noSet';

        if (data[i].orientation  == 'Ht' &&  data[i].genre == 'M'){
            orient = 'Woman';
        } else if (data[i].orientation == 'Ht' &&  data[i].genre == 'Mme'){
            orient = 'Man';
        } else if (  data[i].orientation  == 'Hm' &&  data[i].genre == 'M') {
            orient = 'Man';
        } else if ( data[i].orientation == 'Hm' && data[i].genre == 'Mme') {
            orient = 'Woman';
        } else if ( data[i].orientation == 'Bi'){
            orient = 'Everybody';
        }
        if (data[i].img[0]) {
            img = data[i].img[0];
            imgclass = 'parent';
        }
        else{
            imgclass = 'img-thumbnail'
            img = '/img/no_image.png';
        }
        if (!data[i].nTag) {
            data[i].nTag = 0;
        }
        if (data[i].dist == 0)
            data[i].dist = '<i>~1km</i>';
        else if (data[i].dist != null){
            data[i].dist = '<i>' + data[i].dist + ' km</i>';
        }
        else{
            data[i].dist = '<i>undef</i>';
        }


        $('#table').append('<div class="col-sm-6 col-md-3" id="thebox">' +
       '<div class="thumbnail" style="background-image:linear-gradient(180deg,rgb(127, 18, 47), rgb(200, 255, 255));box-shadow: 5px 5px 12px #555;border-radius: 70px;border-style:solid;border-color:black;"" id="mybox">' +
         '<div style="text-align: center"><img style="border-style:solid;border-color:black;border-radius: 10%;box-shadow: 10px 10px 22px #555;" class="'+ imgclass +'" src="'+ img+ '"  alt=""></div>' +
            '<div class="caption">' +
            '<h3><strong>' +  data[i].nom + '&nbsp;' + data[i].prenom + '</strong></h3>' +
            `<div class="col-md-4 column">
            <table class="table">
            <thead>
            <tr>
            <td><strong>Age :</strong></td>  
            <td> 
            <i>${age}</i>  
            </td>
            </tr>
            <tr>
            <td>
            <strong>Popularite:</strong>
    </td>
        <td><i>` +
         data[i].popularite +
            `</i></td>
            </tr>
            <tr>
            <td>
            <strong>Dist:</strong>
    </td>
        <td>` +
         data[i].dist + `
           </td>
            </tr>
            <tr>
            <td>
            <strong>Insterested by :</strong>
            </td>
        <td><i>
       ` + orient + `
    </i></td>
        </tr>
        <tr>
                                <td>
                                    <strong><p>Nombre de Tag en commun:</p></strong>
                                </td>
                                <td>
                <i>${data[i].nTag}</i> 
         </td>
                            </tr>
        </thead>
        </table>

        </div>
        </div>'
            '<p id="b_view" style="display: inline"><a href="/profile/`  + data[i].name + '" class="btn btn-primary" role="button">View profil</a></p>' +
                '</div></div></div>');

    }

};

var onReady = function(e) {
    // ready state
    var status;
    // https://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate
    if (xhr.readyState == 4) { // `DONE`
        console.log("test");
        status = xhr.status;
        if (status == 200) {
            data = JSON.parse(xhr.responseText);
            showTable(data);
            console.log("test4000");
        } else {
            console.log(status);
        }
    }
};

var onError = function(err) {
    // something went wrong with upload
};

function find(sort){
    if (!sort) {
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
        console.log(mySort);
        sortForm.append("mySort", mySort);
        if (data) {
            sortForm.append('data', JSON.stringify(data));
            console.log(sortForm.data + "HAHHAHAHAHAHHA");
        }
        $('#table').empty();
        xhr.open('POST', "/dashboard/sort", true);
        xhr.setRequestHeader('X-Requested-With', 'xmlhttprequest');
        xhr.addEventListener('error', onError, false);
        xhr.addEventListener('progress', onProgress, false);
        xhr.send(sortForm);
        xhr.addEventListener('readystatechange', onReady, false);
    }
}