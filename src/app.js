const express = require("express")
const router = require("./routes/index.js")
const walletRoute = require("../src/modules/wallet/wallet.router.js")
const app = express()
app.use(express.json())
app.use("/api",router)
module.exports = app