const multer = require('multer');

const MIME_TYPES = {
    'images/jpg' :'jpg',
    'images/jpeg' : 'jpeg',
    'images/png' : 'png',
    'images/webpm' : 'webpm'
};

const storage = multer.diskStorage({

    destination : (req, file, cb) => {
        cb(null, '../../public/images')
    },
    filename : (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname.trim().split(' ').join('_'));
    }
})

const fileFilter = (req, file, cb) => {

    if(!MIME_TYPES.hasOwnProperty(file.mimetype)) return (res.status(500).json({message : `Mauvais format d'image !`}));

    cb(null, true);       
}


module.exports = multer({storage, fileFilter});
