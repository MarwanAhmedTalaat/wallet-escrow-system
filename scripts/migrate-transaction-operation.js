require("dotenv").config()

const connectDB = require("../src/config/database.js")
const Transaction = require("../src/modules/transaction/transaction.model.js")

const migrate = async () => {
    await Transaction.updateMany(
    { type: { $exists: true } },
    [
        { $set: { operation:"$type"}},
        { $unset:"type"}
    ],
    { updatePipeline: true }
)

    console.log("migration done")
    process.exit()
}

const run = async () => {
    await connectDB()
    await migrate()
}
run()