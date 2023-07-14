const { default: mongoose } = require("mongoose");

const Users = mongoose.Schema({
    Name:{
        type:String,
        required:true,
    },
    Email:{
        type:String,
        required:true
    },
    Password:{
        type:Number,
        required:true
    },
    isBlocked:{
        type :Boolean,
        default:true
    },
    image:{
        type :String,
    }
});
module.exports = mongoose.model("users",Users);