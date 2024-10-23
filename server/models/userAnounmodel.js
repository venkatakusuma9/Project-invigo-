const mongoose = require('mongoose')
const faevents=mongoose.Schema({
    title:String,
    description:String,
    date:String,
    file:String
},{
    timestamps: true
})
module.exports=mongoose.model("faevents",faevents)