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

    const first = transaction[0]
    const category = first.category

    if(category === "transfer"){
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

    if(category === "purchase"){
        const purchaseDebit = transaction.find(
            t => t.category === "purchase" && t.operation === "debit"
        )

        const purchaseCredit = transaction.find(
            t => t.category === "purchase" && t.operation === "credit"
        )

        const feeDebit = transaction.find(
            t => t.category === "fee" && t.operation === "debit"
        )

        const payoutCredit = transaction.find(
            t => t.category === "payout" && t.operation === "credit"
        )

        return {
            referenceId,
            category: "purchase",
            amount: purchaseDebit.amount,
            fee: feeDebit?.amount || 0,
            net: payoutCredit?.amount || 0,
            buyer: purchaseDebit.walletId,
            seller: payoutCredit?.walletId,
            createdAt: purchaseDebit.createdAt
        }
    }

    return transaction
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

    exports.createPendingPayout = async (sellerWallet,escrow,amount,referenceId,option,session) => {

    await Transaction.create([{
        walletId: sellerWallet._id,
        operation: "credit",
        category: "payout",
        status: "pending", 
        remainingAmount: amount, 
        relatedWallet: escrow._id,
        referenceId,
        amount,
        balanceAfter: sellerWallet.balance,
        note: option?.note
    }], { session, ordered: true })

    }
    exports.purchase = async (buyerId, sellerId, amount, option) => {
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

        await this.createPendingPayout(sellerWallet,escrow,net,referenceId,option,session)

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
    exports.reversePayout = async (sellerWallet, escrow, net, referenceId, option, session)=>{
        if(sellerWallet.balance < net) throw new AppError(400,"Seller don't have Enough Money")
        
        sellerWallet.balance-=net
        escrow.balance+=net
        await sellerWallet.save({session})
        await escrow.save({session})
        
        await Transaction.create([{
        walletId: sellerWallet._id,
        operation: "debit",
        category: "refund",
        relatedWallet: escrow._id,
        referenceId,
        amount: net,
        balanceAfter: sellerWallet.balance,
        note: option?.note
    },
    {
        walletId: escrow._id,
        operation: "credit",
        category: "refund",
        relatedWallet: sellerWallet._id,
        referenceId,
        amount: net,
        balanceAfter: escrow.balance,
        note: option?.note
    }],{session,ordered: true})
    
}
    exports.reverseFee = async(revenue,escrow,fee,referenceId, option, session)=>{
        if(revenue.balance < fee) throw new AppError(400,"revenue don't have Enough Money")
        
        revenue.balance -= fee
        escrow.balance += fee
        await revenue.save({session})
        await escrow.save({session})

        await Transaction.create([{
        walletId: revenue._id,
        operation: "debit",
        category: "refund",
        relatedWallet: escrow._id,
        referenceId,
        amount: fee,
        balanceAfter: revenue.balance,
        note: option?.note
    },
    {
        walletId: escrow._id,
        operation: "credit",
        category: "refund",
        relatedWallet: revenue._id,
        referenceId,
        amount: fee,
        balanceAfter: escrow.balance,
        note: option?.note
        }],{session,ordered: true})
    }

    exports.refundBuyer = async (escrow,buyerWallet,amount,referenceId, option, session)=>{
        if(escrow.balance < amount) throw new AppError(400,"escrow don't have Enough Money")
        
        escrow.balance -= amount
        buyerWallet.balance += amount
        await escrow.save({session})
        await buyerWallet.save({session})

        await Transaction.create([{
        walletId: escrow._id,
        operation: "debit",
        category: "refund",
        relatedWallet: buyerWallet._id,
        referenceId,
        amount: amount,
        balanceAfter: escrow.balance,
        note: option?.note
    },
    {
        walletId: buyerWallet._id,
        operation: "credit",
        category: "refund",
        relatedWallet: escrow._id,
        referenceId,
        amount: amount,
        balanceAfter: buyerWallet.balance,
        note: option?.note
        }],{session,ordered: true})
    }

    exports.refund = async(mReferenceId,option)=>{
        const session = await mongoose.startSession()
    session.startTransaction()
    
    try {

    const transactions = await transactionRepo.getTransactionByReferenceId(mReferenceId)

    if(!transactions || transactions.length === 0) throw new AppError(400,"Transaction not found")
        
    const purchaseDebit = transactions.find(t => t.category === "purchase" && t.operation === "debit")
    const payoutCredit = transactions.find(t => t.category === "payout" && t.operation === "credit")
    const feeDebit = transactions.find(t => t.category === "fee" && t.operation === "debit")
    if(!purchaseDebit || !payoutCredit) throw new AppError(400,"Invalid transaction")


    const buyerId =  purchaseDebit.walletId
    const sellerId =  payoutCredit.walletId
    const amount =  purchaseDebit.amount
    const net =   payoutCredit.amount
    const fee =  feeDebit?.amount ||0

    const buyerWallet = await walletRepo.getWallet(buyerId,session)
    const sellerWallet = await walletRepo.getWallet(sellerId,session)
    const {escrow,revenue} = await this.getPlatformWallets()
    
    if(!buyerWallet || !sellerWallet) throw new AppError(400,"Process failed ")
    if(sellerWallet.balance < net) throw new AppError(400,"Seller donot have net")
    if(revenue.balance < fee) throw new AppError(400,"revenue donot have fee")

    const referenceId = new mongoose.Types.ObjectId()

    await this.reversePayout(sellerWallet,escrow,net,referenceId,option,session)
    await this.reverseFee(revenue,escrow,fee,referenceId,option,session)
    await this.refundBuyer(escrow,buyerWallet,amount,referenceId,option,session)

    await session.commitTransaction()
    session.endSession()

    return {
    referenceId,
    originalReferenceId: mReferenceId,
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

    exports.getPayoutsStatus = async(walletId)=>{
        const payouts = await Transaction.find({
            walletId,
            category : "payout"
        })
        const now = Date.now()
        const days_14 = 10 * 1000
        const result = payouts.map(t=>{
                
            return {
                
                    referenceId : t.referenceId,
                    amount : t.amount,
                    status : t.status,
                    createdAt : t.createdAt
                }
            }
        )
        return result
    }



    exports.withdraw = async (walletId, amount) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    
    try {
        if (amount <= 0) throw new AppError(400, "Invalid amount")
        const referenceId = new mongoose.Types.ObjectId()
        const availablePayouts = await transactionRepo.getAvailablePayouts(walletId, session)
        const withdrawableAmount = availablePayouts.reduce(
            (sum, t) => sum + t.remainingAmount, 0
        )
        if (amount > withdrawableAmount) throw new AppError(400, "Insufficient withdrawable balance")

        let remaining = amount
        for (let t of availablePayouts) {
            if (remaining <= 0) break
            const take = Math.min(t.remainingAmount, remaining)
            remaining -= take
            t.remainingAmount -= take
            if (t.remainingAmount === 0) {
                t.status = "used"
            }
            await t.save({ session })
        }

        const wallet = await walletRepo.getWallet(walletId, session)
        if (!wallet) throw new AppError(400, "Wallet not found")

        const { escrow } = await this.getPlatformWallets()

        escrow.balance -= amount
        wallet.balance += amount
        await wallet.save({ session })
        await escrow.save({ session })

        await Transaction.create([{
            walletId,
            operation: "debit",
            category: "withdraw",
            referenceId,
            amount,
            balanceAfter: wallet.balance
        }], { session, ordered: true })

        await session.commitTransaction()
        session.endSession()

            const newAvailable = availablePayouts.reduce(
    (sum, t) => sum + t.remainingAmount,
    0
    )
        return {
            referenceId,
            amount,
            balanceAfter: wallet.balance,
            withdrawableLeft: newAvailable
        }

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}
