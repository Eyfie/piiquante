const fs = require('fs');
const Sauce = require('../model/sauce.model');


/**
 * @category Controller
 * @subcategory Sauce
 * 
 * @function getAllSauces
 * @description Get all the sauces
 * @async
 *  
 * @param {Array} res - Array containing all sauces object
 * 
 * @return {Array} All the sauces object
 */

exports.getAllSauces = async (req, res, next) => {
    try {

        const sauces = await Sauce.find();
        res.status(200).json(sauces);
        
    } catch (error) {
        res.status(400).json({message : 'Oops something went wrong'})
    }
}


/**
 * @category Controller
 * @subcategory Sauce
 * 
 * @function getSauce
 * @description Get the matching ID sauce
 * @async
 * 
 * @param {Object} req - Request body sent by express
 * @param {Object} req.params - Object containing URL and its parameters
 * @param {String} req.params.id - Requested ID 
 * @param {Object} res - Object containing properties of the matching sauce
 * 
 * @return {Object} - Return the sauce object and its parameters
 * 
 */

exports.getSauce = async (req, res, next) => {
    try {

        const { id } = req.params;

        const sauce = await Sauce.findById(id);
        res.status(200).json(sauce);

    } catch (error) {
        res.status(400).json({message : 'Oops something went wrong'});
    }
}


/**
 * @category Controller
 * @subcategory Sauce
 * 
 * @function createSauce
 * @description Create a sauce
 * @async
 * 
 * @param {Object} req
 * @return {Void} 
 */

exports.createSauce = async (req, res, next) => {
    try {
        
        const sauce = await new Sauce({
            ...JSON.parse(req.body.sauce),
            imageUrl : `${req.protocol}://${req.get('host')}/backend/public/images/${req.file.filename}`
        });

        await sauce.save()

        res.status(200).json({message : 'Sauce created !'});

    } catch (error) {
        res.status(400).json({message : 'Oops something went wrong !'})
    }
}


/**
 * @category Controller
 * @subcategory Sauce
 * 
 * @function modifySauce
 * @description Verify if user is allowed to change the sauce and then update it
 * @async
 * 
 * @param {Object} req
 * @param {Object} req.params - Object containing URL and its parameters
 * @param {String} req.params.id - ID of the sauce
 * @param {Object} req.auth - Object containing information about the user
 * @param {String} req.auth.userId  - User ID
 * @return {Void}
 */

exports.modifySauce = async (req, res, next) => {
    try {
        
        const {id} = req.params;
        const {auth} = req;

        
        const data = req.file ? 
        {
            ...JSON.parse(req.body.sauce),
            imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {...req.body};

        //*Check if sauce exist
        const sauce = await Sauce.findById(id);
        if(!sauce) throw res.status(404).json({message :'Sauce not found !'});

        //*Check if user is authorized to change the sauce
        if(sauce.userId != auth.userId) throw res.status(403).json({message : `${req.body.name} n'est pas votre sauce !`});
 

        Sauce.updateOne({_id : id}, data);

    } catch (error) {
        res.status(400).json({message : 'Bad Request !'})
    }
}



/**
 * @category Controller
 * @subcategory Sauce
 * 
 * @function deleteSauce
 * @description Verify if the sauce belongs to user and then delete it if it's the case
 * @async
 * 
 * @param {Object} req 
 * @param {Object} req.auth - Object containing information about the user input that launched the request
 * @param {String} req.auth.userId - ID of the user that launched the input
 * @param {String} req.userId - User ID of the sauce creator
 * 
 * @return {Void}
 */

exports.deleteSauce = async (req, res, next) => {
    try {

        //*Check if the sauce exist
        const sauce = await Sauce.findById(id);
        if(!sauce) throw res.status(404).json({message : 'Sauce not found !'});

        //*Check if user is the one that created the sauce
        if(sauce.userId !== req.auth.userId) throw res.status(403).json({message : 'Unauthorized request !'});

        //* Delete the sauce
        await Sauce.deleteOne({_id : id});
        res.status(201).json({message : 'Sauce deleted'});

    } catch (error) {
        res.status(400).json({message : 'error'});
    }
}



