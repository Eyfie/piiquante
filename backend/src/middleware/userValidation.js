
/**
 * @category Middleware
 * 
 * 
 * @description Check if sign up email and password are valid
 * @param {Object} req - Object de requête envoyé par express
 * @param {Object} req.body - Formated request body as json
 * @param {String} req.body.email - Input email
 * @param {String} req.body.password - Input password
 * @module userValidation
 * 
 */
module.exports = async (req, res, next) => {

    try {

        const {email, password} = req.body;

        const verify = {
            email : {
                regex : /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message : 'Email non valide !'
            },
            password : {
               regex :  /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,36}$/g,
               message : 'Votre mot de passe doit contenir 8 caractères au minimum dont 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial'
            }
        }

        const isEmailValid = await email.match(verify.email.regex);
        const isPasswordValid = await password.match(verify.password.regex);

        if(!isEmailValid) throw error = res.status(400).json(verify.email.message);
        if(!isPasswordValid) throw error = res.status(400).json(verify.password.message);

        next()

    } catch (error) {
        next(error)
    }
}