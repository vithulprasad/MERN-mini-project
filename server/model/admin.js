const { default: mongoose } = require("mongoose");

const Admin = mongoose.Schema({

    Email:{
        type:String,
        required:true
    },
    Password:{
        type:Number,
        required:true
    }
 
});
module.exports = mongoose.model("admin",Admin);