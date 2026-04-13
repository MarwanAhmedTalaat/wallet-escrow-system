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
    enum: ["transfer","refund","fee"]
    },
    relatedWallet : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Wallet"
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
transactionSchema.index({ walletId: 1, createdAt: -1 })
const Transaction = mongoose.model("Transaction",transactionSchema)
module.exports = Transaction