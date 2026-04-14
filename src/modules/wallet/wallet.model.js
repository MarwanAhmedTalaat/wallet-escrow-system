const mongoose = require("mongoose")
const walletSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    type : {
        type : String,
        unique : true,
        enum : ["user","escrow","revenue"],
        default : "user"
    },
    balance :{
        type : Number,
        default : 0
    }
})
const Wallet = mongoose.model("Wallet",walletSchema)
module.exports = Wallet