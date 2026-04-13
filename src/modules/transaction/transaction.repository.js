const Transaction = require("./transaction.model.js")
exports.getWalletTransactions = (walletId)=>{
    const transactions =  Transaction.find({walletId}).populate("relatedWallet","_id")
    return transactions
}