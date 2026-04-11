const walletService = require("./wallet.service.js")
exports.createWallet = async (req,res)=>{
    const result = await walletService.createWallet()
    res.json({
        success : true,
        data : result
    })
}