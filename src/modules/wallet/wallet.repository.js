const Wallet = require("../wallet/wallet.model.js")
exports.createWallet = async(data)=>{
    const wallet = await Wallet.create(data)
    return wallet
}
exports.getAllWallet = async ()=>{
    const wallets = await Wallet.find()
    return wallets
}
exports.getWallet = async (id, session)=>{
    const query = Wallet.findById(id)
    if(session) query.session(session)
    return await query
}