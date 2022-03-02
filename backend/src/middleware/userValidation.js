
/**
 * @category Middleware
 * 
 * 
 * @description Check if subscription email and password are valid
 * @param {Object} req - Object de requête envoyé par express
 * @param {String} req.email - Input email
 * @param {String} req.password - Input password
 * @module userValidation
 * 
 */
module.exports = async (req, res, next) => {

    try {

        const {email, password} = req.body;

        const regex = {
            email : /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            //TODO Password regex fucking sucks change it (1MAJ, 1Min, 1NUmber, 1SpecChar, 8Length)
            password : /^[0-9A-Za-zÀ-ÿ-', ]{8,}$/g
        }

        const isEmailValid = await email.match(regex.email);
        const isPasswordValid = await password.match(regex.password);

        if(!isPasswordValid || !isEmailValid) throw error = res.status(400).json({message : 'Bad request'});

        next()

    } catch (error) {
        next(error)
    }
}