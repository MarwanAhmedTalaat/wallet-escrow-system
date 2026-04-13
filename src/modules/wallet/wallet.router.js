const express = require("express")
const router = express.Router()
const walletController = require("../wallet/wallet.controller.js")
const validateWallet = require("./wallet.validation.js")

router
.route("/")
.post(validateWallet.validateCreateWallet, walletController.createWallet)
.get(walletController.getAllWallet)

router
.route("/:id")
.get(walletController.getWallet)

router
.route("/:id/balance")
.get(walletController.getBalance)

router
.route("/:id/credit")
.patch(validateWallet.validateAmount, walletController.creditWallet)

router
.route("/:id/debit")
.patch(validateWallet.validateAmount, walletController.debitWallet)

router
.route("/:id/transactions")
.get(walletController.getWalletTransactions)

router
.route("/:id/transfer")
.post(walletController.transfer)

module.exports = router