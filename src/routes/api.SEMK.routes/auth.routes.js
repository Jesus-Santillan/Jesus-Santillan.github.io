const { get_registro,get_inicio,create } = require('../../controllers/auth.controller');
const router = require('express').Router();

router.get('/inicio', get_inicio);
router.get('/registro', get_registro);
router.post('/',create);

module.exports = router;
