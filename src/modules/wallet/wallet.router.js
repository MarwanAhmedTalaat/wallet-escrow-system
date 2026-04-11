const express = require("express")
const Router = express.Router()
Router
.route("/")
.post((req,res)=>{
    res.json({
        success : true,
        message : "create wallet"
    })
})
module.exports = Router