const Transaction = require("./transaction.model.js")
exports.getWalletTransactions = (walletId)=>{
    const transactions =  Transaction.find({walletId}).populate("relatedWallet","_id")
    return transactions
}
exports.getTransactionByReferenceId = (referenceId)=>{
    const transaction = Transaction.find({referenceId})
    return transaction
}
    exports.getAvailablePayouts = async (walletId, session) => {

        const pendingPayouts = await Transaction.find({
            walletId,
            category: "payout",
            status: "pending"
        })

        const now = Date.now()
        const delay = 10 * 1000 

        for (let t of pendingPayouts) {
            if (now - t.createdAt >= delay) {
                t.status = "available"
                await t.save({ session })
            }
        }

        const query = Transaction.find({
            walletId,
            category: "payout",
            status: "available"
        }).sort({ createdAt: 1 })

        if (session) query.session(session)

        return await query
    }