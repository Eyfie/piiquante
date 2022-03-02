const sauce = require('../controller/sauce.controller');
const isAuth = require('../middleware/isAuth');
const imgUpload = require('../middleware/multer');
const router =  require('express').Router();

//* Get all the sauce
router.get('/', sauce.getAllSauces);

//* Handling CRUD
router.get('/:id', sauce.getSauce);
router.post('/', imgUpoad, sauce.createSauce);
router.put('/:id', isAuth, imgUpload, sauce.modifySauce);
router.delete('/:id', isAuth, sauce.deleteSauce);

//* Likes handler
router.post(':id/like');



module.exports = router;