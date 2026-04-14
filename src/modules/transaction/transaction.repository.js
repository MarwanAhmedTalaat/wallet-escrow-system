const Transaction = require("./transaction.model.js")
exports.getWalletTransactions = (walletId)=>{
    const transactions =  Transaction.find({walletId}).populate("relatedWallet","_id")
    return transactions
}
exports.getTransactionByReferenceId = (referenceId)=>{
    const transaction = Transaction.find({referenceId})
    return transaction
}