exports.validateCreateWallet = (req,res,next)=>{
    if(!req.body.name) return res.status(400).json({
        success : false,
        message : "Please Enter Your Name"
    })
    next()
}
exports.validateAmount = (req,res,next)=>{
    const {amount} = req.body
    if(!amount) return res.status(400).json({
        success : false,
        message : "Please Enter Your amount"
    })
    if(amount <= 0 || typeof amount !== "number") return res.status(400).json({
        success : false,
        message : "Please Enter Valid Amount"
    })
    next()
}
