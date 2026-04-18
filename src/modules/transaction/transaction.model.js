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
    category : {
    type : String,
    enum: ["transfer","refund","fee","purchase","payout","withdraw"]
    },
    status :{
    type : String,
    enum : ["pending","available","used"],
    default : "pending"
    },
    remainingAmount : {
        type : Number 
    },
    relatedWallet : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Wallet"
    },
    referenceId : {
    type : mongoose.Schema.Types.ObjectId
    },
    amount : {
        type : Number,
        required : true
    },
    balanceAfter : {
        type : Number,
        required :true
    },
    note : {
        type : String
    }
},{
    timestamps: true
})
transactionSchema.index({ walletId: 1, createdAt: -1 })
transactionSchema.index({ referenceId: 1 })
const Transaction = mongoose.model("Transaction",transactionSchema)
module.exports = Transaction