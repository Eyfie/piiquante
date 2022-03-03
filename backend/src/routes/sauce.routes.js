const sauce = require('../controller/sauce.controller');
const isAuth = require('../middleware/isAuth');
const uploadImage = require('../middleware/imgUpload');
const router =  require('express').Router();

//* Get all the sauce
router.get('/', sauce.getAllSauces);

//* Handling CRUD
router.get('/:id', sauce.getSauce);
router.post('/', uploadImage.single('image'), sauce.createSauce);
router.put('/:id', isAuth, uploadImage.single('image'), sauce.modifySauce);
router.post('/:id/like', sauce.likeSauce);
router.delete('/:id', isAuth, sauce.deleteSauce);


//* Likes handler
router.post(':id/like', sauce.likeSauce);



module.exports = router;