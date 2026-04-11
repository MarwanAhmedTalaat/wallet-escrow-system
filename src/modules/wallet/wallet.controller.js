const walletService = require("./wallet.service.js")
exports.createWallet = async (req,res,next)=>{
    const data = await walletService.createWallet(req.body)
    res.json({
        success : true,
        data : data
    })
}
exports.getWallet = async(req,res,next)=>{
    const {id} = req.params
    const data = await walletService.getWallet(id)
    if(!data) return res.status(404).json({
        success : false,
        messgae : "Wallet with this ID not founded"
    })
    res.status(200).json({
        success : true,
        data : data
    })
}