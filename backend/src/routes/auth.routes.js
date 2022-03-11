const router = require('express').Router();
const user = require('../controller/auth.controller');
const userValidation = require('../middleware/userValidation');
const limiter = require('../middleware/limiter');


router.post('/login', user.login);
router.post('/signup', limiter.createAccountLimiter, userValidation, user.signup);


module.exports = router;