const AppError = require("../utils/AppError.js")
const GlobalError = (err,req,res,next) => {
    let error = {...err}
    error.status = err.status
    error.message=err.message
    if(err.kind=="ObjectId"){
        error = new AppError(400,"Length of ID Wrong !")
    }
    if(err.name == "ValidationError"){
        let message = Object.values(err.errors).map(e=>e.message).join(",")
        error = new AppError(400,message)
    }
    if (error.operational) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message
        })
    }
    res.status(error.status||500).json({
        success : false ,
        message : "Internal Server Error"
    })
}
module.exports = GlobalError
