/**
 * Created by tapostin on 10/6/16.
 */
var express = require('express');
var router = express.Router();

router.get('/:userID', (req, res)=>{
    let Profile = require('../models/utilisateur');
    console.log(req.params.userID + "hahahah!!!");
    console.log("PROFILLE---" + req.params.userID);
    Profile.findUsers3(req.params.userID, (ret)=>{

        res.render('profile', {ret : ret[0]});
    })

});
module.exports = router;