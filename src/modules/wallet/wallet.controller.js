const walletService = require("./wallet.service.js")
const catchAsync = require("../../core/utils/catchAsync.js")
const AppError = require("../../core/utils/AppError.js")
exports.createWallet = catchAsync(async (req,res,next)=>{
    const data = await walletService.createWallet(req.body)
    res.json({
        success : true,
        data : data
    })
}) 
exports.getAllWallet = catchAsync(async(req,res,next)=>{
    const wallets = await walletService.getAllWallet()
    if( wallets.length === 0) return res.status(200).json({
        success : true,
        message : "No wallets to display"
    })
    res.status(200).json({
        success : true,
        wallets : wallets
    })
})
exports.getWallet = catchAsync(async(req,res,next)=>{
    const wallet = await walletService.getWallet(req.params.id)
    res.status(200).json({
        success : true,
        data : wallet
    })
}) 
exports.getBalance = catchAsync(async(req,res,next)=>{
    const balance = await walletService.getBalance(req.params.id)
    res.status(200).json({
        data : balance
    })
}) 
exports.creditWallet = catchAsync(async(req,res,next)=>{
    const credit = await walletService.creditWallet(req.params.id,req.body.amount)
    res.status(200).json({
        success : true,
        balance : credit
    })
})
exports.debitWallet = catchAsync(async (req,res,next)=>{
    const debit = await walletService.debitWallet(req.params.id,req.body.amount)
    res.status(200).json({
        success : true,
        balance : debit
    })
})
exports.getWalletTransactions = catchAsync(async(req,res,next)=>{
    const transactions = await walletService.getWalletTransactions(req.params.id,req.query)
    if(transactions.length === 0) return res.status(200).json({
        success : true,
        message : "No Transaction for this wallet "
    })
    const formatted = transactions.map(t => {
    let description = null
    let direction = null
    if(t.category === "transfer"){
        if(t.operation === "debit"){
            description = `Transfer to wallet ${t.relatedWallet._id}`
            direction = "out"
        }else{
            description = `Transfer from wallet ${t.relatedWallet._id}`
            direction = "in"
        }
    }
    const obj = t.toObject()
    if(description) obj.description = description
    if(direction) obj.direction = direction
    return obj
    })
    res.status(200).json({
        success : true,
        data : formatted
    })
})
exports.transfer = catchAsync(async (req,res,next) => {
    const {toWalletId,amount} = req.body
    const transfer = await walletService.transfer(req.params.id,toWalletId,amount)
    res.status(200).json({
        success : true,
        data : transfer
    })
})