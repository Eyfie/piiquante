const router = require('express').Router();
const user = require('../controller/auth.controller');
const userValidation = require('../middleware/userValidation');


router.post('/login', user.login);
router.post('/signup', userValidation, user.signup);


module.exports = router;