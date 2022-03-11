const fs = require('fs/promises');
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
        res.status(400).json({error : 'Oops something went wrong'})
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
 * @param {Object} req.params - Object containing URL's parameters
 * @param {String} req.params.id - Requested ID 
 * @param {Object} res - Object containing properties of the matching sauce
 * 
 * @return {Object} - Return the sauce object and its parameters
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
 * @param {Object} req - Request body sent by express
 * @param {Object} req.body - Formated request body as json
 * @param {String} req.body.sauce - All information of the sauce
 * @param {Object} req.file - Object containing all information about the sauce img
 * @param {String} req.file.filename - Formated name of the sauce image
 * 
 * 
 * @return {Void} 
 */
exports.createSauce = async (req, res, next) => {
    try {
        const sauce = new Sauce({
            ...JSON.parse(req.body.sauce),
            imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        });

        await sauce.save()

        res.status(200).json({message : 'Sauce created !'});

    } catch (error) {
        res.status(400).json({message : 'Sauce creation went wrong !'})
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
 * @param {Object} req - Request body sent by express
 * @param {Object} req.body - Formated request body as json
 * @param {String} req.body.sauce - All information of the sauce
 * @param {Object} req.params - Object containing URL's parameters
 * @param {String} req.params.id - ID of the sauce
 * @param {Object} req.auth - Object containing information about the user
 * @param {String} req.auth.userId  - User ID
 * @param {Object} req.file - Object containing all information about the sauce img
 * @param {String} req.file.filename - Formated name of the sauce image
 * 
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
        
        //*Check if there is an image in the request and remove the old one if it's the case
        if(req.file) await fs.unlink(`public/images/${sauce.imageUrl.split('/images/')[1]}`)
    
        await sauce.updateOne(data);

        res.status(200).json({message : 'Sauce updated successfully !'});

   } catch (error) {
         res.status(400).json({message : 'Sauce update went wrong !'})
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
 * @param {Object} req - Request body sent by express
 * @param {Object} req.auth - Object containing information about the user input that launched the request
 * @param {String} req.auth.userId - ID of the user that launched the input
 * @param {Object} req.params - Object containing URL's parameters
 * @param {String} req.params.id - ID of the sauce
 * 
 * @return {Void}
 */
exports.deleteSauce = async (req, res, next) => {
    try {
        const {id} = req.params
        const {auth} = req;

        //*Check if the sauce exist
        const sauce = await Sauce.findById(id);
        if(!sauce) throw res.status(404).json({message : 'Sauce not found !'});

        //*Check if user is the one that created the sauce
        if(sauce.userId !== auth.userId) throw res.status(403).json({message : 'Unauthorized request !'});
    
        //* Delete the sauce and sauce img
        await fs.unlink(`public/images/${sauce.imageUrl.split('/images/')[1]}`); 
        await Sauce.deleteOne({_id : id});
        res.status(201).json({message : 'Sauce deleted'});

    } catch (error) {
        res.status(400).json({message : 'Deleting sauce went wrong'});
    }
}


/**
 * @category Controller
 * @subcategory Sauce
 * 
 * @function likeSauce
 * @description Handle the likes and dislikes on the sauce
 * @async
 * 
 * @param {Object} req - Request body sent by express
 * @param {Object} req.body - Formated request body as json
 * @param {String} req.body.userId - ID of user liking the sauce
 * @param {Number} req.body.like - Value of 1, 0 or -1 indicating respectively like, unlike/undislike, dislike sent by user
 * @param {Object} req.params - Object containing URL's parameters
 * @param {String} req.params.id - ID of the sauce
 * 
 * @return {Void}
 */
exports.likeSauce = async (req, res, next) => {
  try {
    const {id} = req.params;
    const {userId} = req.body;
    const {like} = req.body;

    const sauce = await Sauce.findById(id);

    let {usersLiked, usersDisliked} = sauce;

switch(like){
    //* Check [usersLiked] and add userId if necessary, remove userId from [usersDisliked]
    case 1 :
        usersLiked = usersLiked.includes(userId) ? usersLiked : [...usersLiked, userId];
        usersDisliked = usersDisliked.filter((id) => id !== userId);
        break;
        
    //* Remove userId from [usersLiked] and [usersDisliked]
    case 0 :
        usersLiked = usersLiked.filter((id) => id !== userId);
        usersDisliked = usersDisliked.filter((id) => id !== userId);
        break;
    
    //* Check [usersDisliked] and add userId if necessary, remove userId from [usersLiked]
    case -1 :
        usersDisliked = usersDisliked.includes(userId) ? usersDisliked : [...usersDisliked, userId];
        usersLiked = usersLiked.filter((id) => id !== userId);
        break;
}

    const likes = usersLiked.length;
    const dislikes = usersDisliked.length;


    await sauce.updateOne({usersLiked, usersDisliked, likes, dislikes});
    res.status(200).json({message : 'Sauce liked / disliked !'})

  } catch (error) {
      res.status(400).json({message : 'Sauce like went wrong !'});
  }
}



