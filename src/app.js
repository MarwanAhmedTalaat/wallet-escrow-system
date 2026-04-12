const express = require("express")
const morgan = require("morgan")
const router = require("./routes/index.js")
const GlobalError = require("./core/middleware/GlobalError.js")
require("dotenv").config()
const app = express()
app.use(express.json())
app.use(morgan("dev"))
app.use("/api",router)
app.use((req,res,next)=>{
    res.status(404).json({
        succeess : false,
        messgae : "Page Not Found"
    })
})
app.use(GlobalError)
module.exports = app