$(function () {

   if(navigator.geolocation){
       navigator.geolocation.getCurrentPosition(function(position){
            //$("#geoResult").val(JSON.stringify(cloneAsObject(position.coords)));
        })
    }
        $.getJSON("http://ip-api.com/json/?callback=?", function(data) {
            $("#geoResult").val(JSON.stringify(data));
     });

});