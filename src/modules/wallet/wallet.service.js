const walletRepo = require("../wallet/wallet.repository.js")
const Transaction = require("../transaction/transaction.model.js")
const transactionRepo = require("../transaction/transaction.repository.js")
const mongoose = require("mongoose")
const feature = require("../../core/utils/apiFeatures.js")
const AppError = require("../../core/utils/AppError.js")
const apiFeatures = require("../../core/utils/apiFeatures.js")
exports.createWallet = async (data)=>{
    return await walletRepo.createWallet(data)
}
exports.getAllWallet = async()=>{
    const wallets = await walletRepo.getAllWallet()
    return wallets
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
exports.getWalletTransactions = async (walletId,query)=>{
    const feature = new apiFeatures(transactionRepo.getWalletTransactions(walletId),query).pagination()
    const transaction = await feature.query
    if(!transaction) throw new AppError(400,"Transaction for this Wallet not found")
    return transaction
}
exports.transfer = async (from , to , amount)=>{
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
    const walletFrom = await walletRepo.getWallet(from, session)
    const walletTo = await walletRepo.getWallet(to, session)
    if(!walletFrom || !walletTo) throw new AppError(400,"Transfer Failed !")
    if(from === to) throw new AppError(400,"Cannot transfer to same wallet")
    if(walletFrom.balance < amount) throw new AppError(400,"You don't have enough balance to make this transfer")
    walletFrom.balance -= amount
    walletTo.balance += amount
    await walletFrom.save({ session })
    await walletTo.save({ session })
    await Transaction.create([{walletId: walletFrom._id,operation: "debit",category: "transfer",relatedWallet: walletTo._id,amount,balanceAfter: walletFrom.balance}],{ session }
    )
    await Transaction.create([{walletId: walletTo._id,operation: "credit",category: "transfer",relatedWallet: walletFrom._id,amount,balanceAfter: walletTo.balance}],{ session }
    )
    await session.commitTransaction()
    session.endSession()
    return { transactionId: Transaction._id, from: walletFrom._id, to: walletTo._id, amount, balanceAfter: walletFrom.balance }
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}