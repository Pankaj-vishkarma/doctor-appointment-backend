const mongoose=require('mongoose')
const {Schema}=mongoose

const doctorSchema=new Schema({
    userId:{
        type:String
    },
    firstname:{
        type:String,
    },
    lastname:{
        type:String,
    },
    phone:{
        type:String,
    },
    email:{
        type:String,
    },
    website:{
        type:String
    },
    address:{
        type:String,
    },
    specification:{
        type:String,
    },
    experience:{
        typs:String,
    },
    feesPerConsaltation:{
        type:String,
    },
    status:{
       type:String,
       default:'pending'
    },
    timings:{
        type:Object,
    }
},{
    timestamps:true
})

module.exports=mongoose.model('doctor',doctorSchema)