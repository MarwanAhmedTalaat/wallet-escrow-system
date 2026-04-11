const walletRepo = require("../wallet/wallet.repository.js")
exports.createWallet = async ()=>{
    return await walletRepo.createWallet()
}