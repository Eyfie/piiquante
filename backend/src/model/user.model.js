const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


//* User DB model
const userSchema = new mongoose.Schema({

    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true
    },
    
    password : {
        type : String,
        required : true
    }
});


userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);


