let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
var multer = require('multer')
var upload = multer({dest: "../public/img/"})
let Utilisateur = require('../models/utilisateur')
let bcrypt = require('bcryptjs')
var cities = require('cities')
var NodeGeocoder = require('node-geocoder')
var chat = require('../models/chat_function')

router.use(bodyParser.urlencoded({ extended: false }));
router.use(require('../middlewares/flash'));

var options = {
  provider: 'google',
  httpAdapter: 'https', 
  apiKey: 'AIzaSyD147j2Z24YygItMAkU4OrYnnnsICOGtlU',
  formatter: null
};

var geocoder = NodeGeocoder(options);

function requireLogin (req, res, next) {
  if (!req.user) {
    req.flash('error', "il faut s'autentifier")
    res.redirect('/login');
  } else {
    next();
  }
};

router.get('/', requireLogin, function(req, resu, next) {
  Utilisateur.findUsers3(req.user.name, (result)=>{

    if (result[0].tag){
      var newTag = [];
      for (var i = 0; i < result[0].tag.length; i++)
        newTag[i] = '#' + result[0].tag[i];
    }

    var lat = result[0].geo.latitude;
    var lng = result[0].geo.longitude;

      if (lat && lng){
      geocoder.reverse({'lat':lat, 'lon':lng}, function(err, res) {
        if (res[0].city){
          var city = res[0].city;
          var country = res[0].country;
        }
        else{
          var city = '';
          var country = '';
        }
        resu.render('compte', {ret : result, tag : newTag, city: city, country: country, user: result});
      });
    }else{
        var city = '';
        var country = '';
        newTag = ''
        resu.render('compte', {ret : result, tag : newTag, city: city, country: country, user: result}); 
      }
    })

});


router.post('/form_compte', (request, response)=>{
  
  Utilisateur.modifUser(request, (res, err)=>{
    if (err)
      request.flash('error', err)
    else
      request.flash('success', "informations bien enregistrées")
  })
  response.redirect('/dashboard')
})


module.exports = router;