const router = require('express').Router();

router.use('/auth', require('./api.SEMK.routes/auth.routes'));

module.exports = router;
