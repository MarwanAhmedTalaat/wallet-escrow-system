const express = require("express")
const Router = express.Router()
const walletController = require("../wallet/wallet.controller.js")
const validateWallet = require("./wallet.validation.js")
Router
.route("/")
.post(validateWallet.validateCreateWallet,walletController.createWallet)
Router
.route("/:id")
.get(walletController.getWallet)
Router
.route("/:id/balance")
.get(walletController.getBalance)
Router
.route("/:id/credit")
.patch(validateWallet.validateAmount,walletController.creditWallet)
Router
.route("/:id/debit")
.patch(validateWallet.validateAmount,walletController.debitWallet)
Router
.route("/:id/transactions")
.get(walletController.getWalletTransactions)
module.exports = Router