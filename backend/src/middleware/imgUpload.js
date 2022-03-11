const multer = require('multer');
const path = require('path');

const WHITELIST = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];

const storage = multer.diskStorage({

    destination : (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename : (req, file, cb) => {
        const name = file.originalname.split('.')[0].trim().split(' ').join('_');
        const img =  Date.now() + '-' + name + path.extname(file.originalname);
        cb(null, img);
    }
})


const isValidFormat =  (req, file, cb) => {
    if(!WHITELIST.includes(file.mimetype)) return cb(new Error('File type not allowed !'), false);
    cb(null, true); 
};



module.exports = multer({storage, fileFilter : isValidFormat});
