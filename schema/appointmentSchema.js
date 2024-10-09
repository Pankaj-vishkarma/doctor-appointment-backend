const mongoose=require('mongoose')
const {Schema}=mongoose

const appointmentSchema=new Schema({
    userId:{
        type:String,
    },
    doctorId:{
        type:String,
    },
    doctorInfo:{
        type:String,
    },
    userInfo:{
        type:String,
    },
    date:{
        type:String,
    },
    status:{
        type:String,
        default:'pending'
    },
    time:{
        type:String,
    }

},{timestamps:true})

module.exports=mongoose.model('appointmentSchema',appointmentSchema) 