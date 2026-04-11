const walletService = require("./wallet.service.js")
exports.createWallet = (req,res)=>{
    const result=walletService.createWallet()
    res.json({
        success : true,
        data : result
    })
}