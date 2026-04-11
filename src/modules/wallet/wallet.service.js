const walletRepo = require("../wallet/wallet.repository.js")
exports.createWallet = async (data)=>{
    return await walletRepo.createWallet(data)
}
exports.getWallet = async (id)=>{
    return await walletRepo.getWallet(id)
}