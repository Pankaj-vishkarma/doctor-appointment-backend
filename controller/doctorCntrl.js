const doctorSchema=require('../schema/DoctorSchema')
const appointmentSchema = require('../schema/appointmentSchema')
const userSchema=require('../schema/userSchema')

const getDoctorInfo=async(req,res)=>{
 try{
      const {userId}=req.body

      const doctor=await doctorSchema.findOne({userId:userId})
      if(!doctor){
        return res.status(200).json({
            success:false,
            message:"There is no any Doctor present"
        })
      }

      return res.status(200).json({
        success:true,
        message:"Doctor information is fatched successfully",
        data:doctor
      })
 }catch(e){
    return res.status(400).json({
        success:false,
        message:e,
        message:"Doctor information is not get"
    })
 }
}

const updateProfile=async(req,res)=>{
  try{
       const {userId}=req.body
       const doctor=await doctorSchema.findOneAndUpdate({userId:userId},req.body)
       return res.status(200).json({
        success:true,
        message:"profile update successfully",
        data:doctor
       })
  }catch(e){
    return res.status(400).json({
      success:false,
      message:e,
      message:"Profile not update"
    })
  }

}

const getSingleDoctor=async(req,res)=>{
   try{
      const {doctorId}=req.body
      const doctor=await doctorSchema.find({_id:doctorId})

      return res.status(200).json({
        success:true,
        message:"doctor get successfully",
        data:doctor
      })
   }catch(e){
    return res.status(400).json({
      success:true,
      message:e
    })
   }
}

const DoctorAppointment=async(req,res)=>{
 try{
      const doctor=await doctorSchema.findOne({userId:req.body.userId})
      const appointment=await appointmentSchema.find({doctorId:doctor._id})

      return res.status(200).json({
        success:true,
        message:'Doctor Appointment fetch successfully',
        data:appointment
      })
 }catch(e){
  return res.status(400).json({
    success:false,
    message:e.message
  })
 }
}

const statusChnage=async(req,res)=>{
  try{
      const {appointmentId,status}=req.body
      const appointment=await appointmentSchema.findByIdAndUpdate(appointmentId,{status})
      const user=await userSchema.findOne({_id:appointment.userId})

      user.notification.push({
        type:"status-updated",
        message:`your appointment hash been updated ${status}`,
        onClickPath:"/doctor-appointment"
      })

      await user.save()

      return res.status(200).json({
        success:true,
        message:"Appointment status updated"
      })
  }catch(e){
    return res.status(400).json({
      success:false,
      message:e.message
    })
  }
}

module.exports={getDoctorInfo,updateProfile,getSingleDoctor,DoctorAppointment,statusChnage}