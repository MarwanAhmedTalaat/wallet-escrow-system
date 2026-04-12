const Transaction = require("./transaction.model.js")
exports.getWalletTransactions = async(walletId)=>{
    const transactions = await Transaction.find({walletId}).sort({createdAt: -1})
    return transactions
}