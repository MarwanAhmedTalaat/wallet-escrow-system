const walletRepo = require("../wallet/wallet.repository.js")
const Transaction = require("../transaction/transaction.model.js")
const transactionRepo = require("../transaction/transaction.repository.js")
const mongoose = require("mongoose")
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
    exports.getWalletTransactions = async (walletId, query) => {
        const total = await Transaction.countDocuments({ walletId })
        const features = new apiFeatures(
            transactionRepo.getWalletTransactions(walletId),query)
        .filter()
        .sort()
        .fields()
        .pagination()
        const transactions = await features.query
        return {
            total,
            page: features.page,
            limit: features.limit,
            transactions
        }
    }
    exports.transfer = async (from , to , amount ,option)=>{
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

        const transferId = new mongoose.Types.ObjectId()
        await Transaction.create([{walletId: walletFrom._id,operation: "debit",category: "transfer",relatedWallet: walletTo._id,referenceId: transferId,amount,balanceAfter: walletFrom.balance,note: option?.note}],{ session }
        )
        await Transaction.create([{walletId: walletTo._id,operation: "credit",category: "transfer",relatedWallet: walletFrom._id,referenceId: transferId,amount,balanceAfter: walletTo.balance,note: option?.note}],{ session }
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
    exports.getTransactionByReferenceId = async (referenceId)=>{
        const transaction = await transactionRepo.getTransactionByReferenceId(referenceId)
        if(!transaction || transaction.length === 0){
            throw new AppError(400,"reference Not Found !")
        }

        const debit = transaction.find(t => t.operation === "debit")
        const credit = transaction.find(t => t.operation === "credit")

        return {
            referenceId: debit.referenceId,
            category: debit.category,
            amount: debit.amount,
            fromWallet: debit.walletId,
            toWallet: credit.walletId,
            note: debit.note,
            createdAt: debit.createdAt
        }
    }

    exports.getPlatformWallets = async ()=>{
        const escrow = await walletRepo.getPlatformWallet("escrow")
        const revenue = await walletRepo.getPlatformWallet("revenue")
        return {escrow,revenue}
    }

    exports.debitBuyerToEscrow = async (buyerWallet,escrow,amount,referenceId,option,session)=>{

    buyerWallet.balance -= amount
    escrow.balance += amount

    await buyerWallet.save({ session })
    await escrow.save({ session })

    await Transaction.create([{
        walletId: buyerWallet._id,
        operation: "debit",
        category: "purchase",
        relatedWallet: escrow._id,
        referenceId,
        amount,
        balanceAfter: buyerWallet.balance,
        note: option?.note
    }],{ session })

    await Transaction.create([{
        walletId: escrow._id,
        operation: "credit",
        category: "purchase",
        relatedWallet: buyerWallet._id,
        referenceId,
        amount,
        balanceAfter: escrow.balance,
        note: option?.note
    }],{ session })
    }
    exports.takePlatformFee = async (escrow,revenue,fee,referenceId,option,session)=>{

    escrow.balance -= fee
    revenue.balance += fee

    await escrow.save({ session })
    await revenue.save({ session })

    await Transaction.create([{
        walletId: escrow._id,
        operation: "debit",
        category: "fee",
        relatedWallet: revenue._id,
        referenceId,
        amount: fee,
        balanceAfter: escrow.balance,
        note: option?.note
    }],{ session })

    await Transaction.create([{
        walletId: revenue._id,
        operation: "credit",
        category: "fee",
        relatedWallet: escrow._id,
        referenceId,
        amount: fee,
        balanceAfter: revenue.balance,
        note: option?.note
    }],{ session })
    }

    exports.creditSellerFromEscrow = async (escrow,sellerWallet,amount,referenceId,option,session)=>{

    escrow.balance -= amount
    sellerWallet.balance += amount

    await escrow.save({ session })
    await sellerWallet.save({ session })

    await Transaction.create([{
        walletId: escrow._id,
        operation: "debit",
        category: "payout",
        relatedWallet: sellerWallet._id,
        referenceId,
        amount,
        balanceAfter: escrow.balance,
        note: option?.note
    }],{ session })

    await Transaction.create([{
        walletId: sellerWallet._id,
        operation: "credit",
        category: "payout",
        relatedWallet: escrow._id,
        referenceId,
        amount,
        balanceAfter: sellerWallet.balance,
        note: option?.note
    }],{ session })
    }
    exports.purchase = async (buyerId,sellerId,amount,option)=>{
    const session = await mongoose.startSession()
    session.startTransaction()
    
    try {

    const { escrow , revenue } = await this.getPlatformWallets()
    const buyerWallet = await walletRepo.getWallet(buyerId, session)
    const sellerWallet = await walletRepo.getWallet(sellerId, session)

    if(!buyerWallet || !sellerWallet) throw new AppError(400,"Wallet not found")
    if(buyerWallet.balance < amount) throw new AppError(400,"Insufficient balance")

    const referenceId = new mongoose.Types.ObjectId()

    await this.debitBuyerToEscrow(buyerWallet,escrow,amount,referenceId,option,session)

    const fee = amount * 0.10
    await this.takePlatformFee(escrow,revenue,fee,referenceId,option,session)

    const net = amount - fee
    await this.creditSellerFromEscrow(escrow,sellerWallet,net,referenceId,option,session)

    await session.commitTransaction()
    session.endSession()

    return {
        referenceId,
        amount,
        fee,
        net
    }

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}
