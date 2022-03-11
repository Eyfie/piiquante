const rateLimit = require('express-rate-limit');


const apiLimiter = rateLimit({
    windowMs : 15*60*100, // 15 minutes
    max : 100, // Max request during the windowMs time
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false // Disable the `X-RateLimit-*` headers
});


const createAccountLimiter = rateLimit({
    windowMs : 60 * 60 *1000, // 1 hour
    max : 5, //Limit each IP to create 5 account per windowMs 
    message:
		'Too many accounts created from this IP, please try again after an hour',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

module.exports = {apiLimiter, createAccountLimiter};
