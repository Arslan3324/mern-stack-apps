const mongoose = require("mongoose");

//const DB = process.env.DATABASE


mongoose.connect('mongodb://127.0.0.1:27017/crud_main_database',{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=> console.log("connection start")).catch((error)=> console.log(error.message));