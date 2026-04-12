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