const walletService = require("./wallet.service.js")
exports.createWallet = async (req,res)=>{
    const data = await walletService.createWallet(req.body)
    res.json({
        success : true,
        data : data
    })
}