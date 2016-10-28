var express = require('express');
let bodyParser = require('body-parser')
var router = express.Router();
let Utilisateur = require('../models/utilisateur');

router.use(require('../middlewares/flash'))
router.use(bodyParser.urlencoded({extended: false}));

router.get('/', requireLogin, (req, res, next)=>{
})

router.post('/upload_img', (req, res)=>{

	console.log('remove')
})
