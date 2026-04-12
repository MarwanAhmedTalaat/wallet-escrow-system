const mongoose = require("mongoose")
const transactionSchema = new mongoose.Schema({
    walletId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Wallet",
        required :true
    },
    operation : {
        type : String,
        enum : ["credit","debit"],
        required :true
    },
    amount : {
        type : Number,
        required : true
    },
    balanceAfter : {
        type : Number,
        required :true
    }
},{
    timestamps: true
})
const Transaction = mongoose.model("Transaction",transactionSchema)
module.exports = Transaction