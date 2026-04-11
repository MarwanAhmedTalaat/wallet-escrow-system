const Wallet = require("../wallet/wallet.model.js")
exports.createWallet = async(data)=>{
    const wallet = await Wallet.create(data)
    return wallet
}
exports.getWallet = async(id)=>{
    const wallet = await Wallet.findById(id)
    return wallet
}