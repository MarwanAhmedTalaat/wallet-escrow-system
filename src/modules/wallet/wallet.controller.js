const walletService = require("./wallet.service.js")
exports.createWallet = async (req,res,next)=>{
    const data = await walletService.createWallet(req.body)
    res.json({
        success : true,
        data : data
    })
}
exports.getWallet = async(req,res,next)=>{
    const wallet = await walletService.getWallet(req.params.id)
    if(!data) return res.status(404).json({
        success : false,
        message : "Wallet with this ID not founded"
    })
    res.status(200).json({
        success : true,
        data : wallet
    })
}
exports.getBalance = async(req,res,next)=>{
    const balance = await walletService.getBalance(req.params.id)
    if(!balance) return res.status(404).json({
        success : false,
        message : "Balance not found"
    })
    res.status(200).json({
        data : balance
    })
}