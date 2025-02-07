const mongoose=require('mongoose');
const MONGO_URI=process.env.MONGO_URI

const connection=mongoose.connect("mongodb://my_mongo_db/urlShortner")
.then(()=>{
    console.log("conneted to database");
})



module.exports=connection;