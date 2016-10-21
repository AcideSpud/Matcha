let express = require('express');
let router = express.Router();


router.get('/', (req, res, next)=>{
	req.session.destroy((err)=>{
		if (err){throw err}
		else res.redirect('/')
	})
})


module.exports = router;