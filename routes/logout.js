let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(require('../middlewares/flash'));

router.get('/', (req, res, next)=>{
	req.session.destroy((err)=>{
		if (err){throw err}
		else{

			res.redirect('/')
		}
	})
})

module.exports = router;