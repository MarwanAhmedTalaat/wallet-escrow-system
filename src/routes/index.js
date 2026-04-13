const express = require('express')
const router = express.Router()

const walletRoute = require("../modules/wallet/wallet.router.js")

router.get("/test",(req,res)=>{
    res.json({
        success : true,
        message : "Hello Server"
    })
})

router.use("/wallet", walletRoute)

module.exports = router