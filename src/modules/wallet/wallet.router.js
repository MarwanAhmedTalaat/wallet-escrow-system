const express = require("express")
const Router = express.Router()
const walletController = require("../wallet/wallet.controller.js")
Router
.route("/")
.post(walletController.createWallet)
module.exports = Router