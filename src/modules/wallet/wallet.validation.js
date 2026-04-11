const validateCreateWallet = (req,res,next)=>{
    if(!req.body.name) return res.status(400).json({
        success : false,
        message : "Please Enter Your Name"
    })
    next()
}
module.exports = validateCreateWallet