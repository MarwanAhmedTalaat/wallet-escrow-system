const express = require("express")
const router = express.Router()
const walletController = require("../wallet/wallet.controller.js")
const validateWallet = require("./wallet.validation.js")

router
.route("/")
.post(validateWallet.validateCreateWallet, walletController.createWallet)
.get(walletController.getAllWallet)

router
.route("/platform")
.get(walletController.getPlatformWallets)

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

router
.route("/:id/payouts-status")
.get(walletController.PayoutsStatus)

router
.route("/transactions/:referenceId")
.get(walletController.getTransactionByReferenceId)
router
.route("/purchase")
.post(walletController.purchase)
router
.route("/refund")
.post(walletController.refund)
router
.route("/:id/withdraw")
.post(walletController.withdraw)
module.exports = router