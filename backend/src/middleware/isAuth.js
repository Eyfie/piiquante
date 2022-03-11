const jwt = require('jsonwebtoken');

/**
 * @category Middleware
 * @module isAuth
 * @description Decode jwt token and pass it through the request object
 * 
 * @param {Object} req - Request object passed by express
 * @param {Object} req.headers - Request headers
 * @param {String} req.headers.authorization - Bearer authorization
 * @param {Object} req.auth - Object containing all token user token information
 * 
 * @return {Object} - Request body with the added decoded token data in req.auth
 */
module.exports = (req, res, next) => {
    try {
      
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
        req.auth = decodedToken;

        next()

    } catch (error) {
        res.status(401).json({})
    }
}