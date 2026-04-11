const express = require('express');
const walletRoute = require("../modules/wallet/wallet.router.js")
const Router = express.Router()
Router
.route("/test")
.get((req,res)=>{
    res.json({
        success :true,
        message : "Hello Test"
    })
})
Router
.use("/wallet",walletRoute)

module.exports = Router