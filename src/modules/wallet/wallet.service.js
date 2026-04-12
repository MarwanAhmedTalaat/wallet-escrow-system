const walletRepo = require("../wallet/wallet.repository.js")
const Transaction = require("../transaction/transaction.model.js")
const transactionRepo = require("../transaction/transaction.repository.js")
const AppError = require("../../core/utils/AppError.js")
exports.createWallet = async (data)=>{
    return await walletRepo.createWallet(data)
}
exports.getWallet = async (id)=>{
    const wallet = await walletRepo.getWallet(id)
    if(!wallet) throw new AppError(400,"Wallet with this ID not found")
    return wallet
}
exports.getBalance = async(id)=>{
    const wallet = await walletRepo.getWallet(id)
    if(!wallet) throw new AppError(400,"Wallet with this ID not found")
    return wallet.balance
}
exports.creditWallet = async (id,amount)=>{
    const wallet = await walletRepo.getWallet(id)
    if(!wallet) throw new AppError(400,"Wallet with this ID not found")
    wallet.balance += amount
    await wallet.save()
    await Transaction.create({walletId:wallet._id,operation:"credit",amount:amount,balanceAfter:wallet.balance})
    return wallet.balance
}
exports.debitWallet = async (id,amount)=>{
    const wallet = await walletRepo.getWallet(id)
    if(!wallet) throw new AppError(400,"Wallet with this ID not found")
    if(wallet.balance < amount) throw new AppError(400,`Proccess Failed ! ----> Your balance is ${wallet.balance}`)
    wallet.balance -= amount
    await wallet.save()
    await Transaction.create({walletId:wallet._id,operation:"debit",amount:amount,balanceAfter:wallet.balance})
    return wallet.balance
}
exports.getWalletTransactions = async (walletId)=>{
    const transaction = await transactionRepo.getWalletTransactions(walletId)
    if(!transaction) throw new AppError(400,"Transaction for this Wallet not found")
    return transaction
}