const express = require("express")
const Router = express.Router()
const walletController = require("../wallet/wallet.controller.js")
const validateCreateWallet = require("./wallet.validation.js")
Router
.route("/")
.post(validateCreateWallet,walletController.createWallet)
module.exports = Router