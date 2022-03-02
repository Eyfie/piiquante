const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user.model');


/**
 * @component Test
 * @category Controller
 * @subcategory Auth Controller
 * 
 * @function signup
 * @description Create a new user with login and crypted password
 * @async
 * 
 * @param {Object} req - Request object passed by express
 * @param {Object} req.body - Formated body request as json
 * @param {String} req.body.email - User email
 * @param {String} req.body.password - User password
 * @param {Object} res - Response object passed by express
 * 
 * @return {Void}
 * 
 */

exports.signup = async (req, res, next) => {
  try {

    const {email, password} = req.body;
    const cryptedPassword = await bcrypt.hash(password, 10);
    const user = new User({email, password : cryptedPassword});

    await user.save()

    res.status(201).json({message : 'User created successfully'});

  } catch (error) {
    res.status(400).json({message : 'User already exist'});
  }
}



/**
 * @category Controller
 * @subcategory Auth
 * 
 * @function login
 * @description Check user input email and password to allow login
 * @async
 * 
 * @param {Object} req - Request object passed by express
 * @param {Object} req.body - Formated request body as json
 * @param {String} req.body.email - Input email
 * @param {String} req.body.password - Input password
 * @param {Object} res - Response object passed by express
 * 
 * @return {Void}
 * 
 */

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        //*Check user
        const user = await User.findOne({email});
        if(!user) throw res.status(401).json({message : 'User not found'});

        //*Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword) throw res.status(401).json({message : 'Wrong password !'});

        //*Create token
        const token = jwt.sign({userId : user._id}, process.env.SECRET_TOKEN, {expiresIn : '24h'});
        res.status(200).json({userId : user._id, token});


    } catch (error) {
        res.status(500).json({message : "Something, somewhere, was very wrong..."});
    }
}