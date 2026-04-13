const Transaction = require("./transaction.model.js")
exports.getWalletTransactions = async(walletId)=>{
    const transactions = await Transaction.find({walletId}).populate("relatedWallet","_id").sort({createdAt: -1})
    return transactions
}