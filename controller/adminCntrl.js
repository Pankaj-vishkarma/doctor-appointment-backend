const userSchema=require('../schema/userSchema')
const doctorSchema=require('../schema/DoctorSchema')

const getAllDoctors=async(req,res)=>{
 try{
     const doctors=await doctorSchema.find({})
     if(!doctors){
        return res.status(200).json({
            success:false,
            messsage:"Sorry no doctor is present"
        })
     }

     return res.status(200).json({
        success:true,
        message:"Get Doctors successfully",
        data:doctors
     })
 }catch(e){
    return res.status(400).json({
        success:false,
        message:e.message
    })
 }
}

const getAllUsers=async(req,res)=>{
  try{
      const users=await userSchema.find({})
      if(!users){
        return res.status(200).json({
            success:false,
            message:"Sorry no Users is present"
        })
      }

      return res.status(200).json({
        success:true,
        message:"users get successfully",
        data:users
      })
  }catch(e){
    return res.status(400).json({
        success:false,
        message:e.message
    })
  }
}

const changeAccountStatusCntrl=async(req,res) => {
  try{
     const {doctorId,status}=req.body
     const doctor=await doctorSchema.findByIdAndUpdate(doctorId,{status})
     const user=await userSchema.findOne({_id:doctor.userId})
     console.log(doctor)
     console.log(user)
     const notification= user.notification
     notification.push({
      type:'doctor-account-request-updated',
      message:`Your Doctor account request has ${status} `,
      onclickPath:'/notification'
     })

     user.isDoctor = status === "approved" ? true :false;
     await user.save()

     return res.status(200).json({
      success:true,
      message:"Account status Updated",
      data:doctor
     })
  }catch(e){
    return res.status(400).json({
      success:false,
      message:e.message
    })
  }
} 

module.exports={getAllDoctors,getAllUsers,changeAccountStatusCntrl}