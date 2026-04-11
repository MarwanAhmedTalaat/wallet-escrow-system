const app =require("./app.js")
const connecteDB = require("./config/database.js")
connecteDB()
const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`Server running On Port ${PORT}`);
})