const Wallet = require("../wallet/wallet.model.js")
exports.createWallet = async(data)=>{
    const wallet = await Wallet.create(data)
    return wallet
}