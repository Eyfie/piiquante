const jwt = require('jsonwebtoken');

/**
 * @category Middleware
 * @module isAuth
 * @description Decode jwt token and pass it through the request object
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
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