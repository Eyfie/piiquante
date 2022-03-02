const multer = require('multer');

const WHITELIST = ['images/jpg', 'images/jpeg', 'images/png', 'images/webp'];

const storage = multer.diskStorage({

    destination : (req, file, cb) => {
        cb(null, '../../public/images')
    },
    filename : (req, file, cb) => {
        const img =  Date.now() + '-' + file.originalname.split(' ').join('_');
        cb(null, img);
    }
})

const isValidFormat =  (req, file, cb) => {
    if(!WHITELIST.includes(file.mimetype)) return cb(new Error('File type not allowed !'), false);
    cb(null, true); 
};



module.exports = multer({storage : storage, fileFilter : isValidFormat});
