const userSchema = require('../schema/userSchema.js')
const emailvalidator=require('email-validator')
const bcrypt=require('bcrypt')
const doctorSchema = require('../schema/DoctorSchema.js')
const appointmentSchema = require('../schema/appointmentSchema.js')
const moment =require('moment')

const RegisterCtrl=async(req,res)=>{
  const {name,email,password,confirmpassword}=req.body 

  if(!name || !email || !password || !confirmpassword){
    return res.status(200).json({
        success:false,
        message:"All fields are required"
    })
  }

  if(password != confirmpassword){
    return res.status(200).json({
        success:false,
        message:"password and confirm password are not match"
    })
  }
  const validEmail=emailvalidator.validate(email)
  if(!validEmail){
    return res.status(400).json({
        success:false,
        messsage:"please provide a valid email"
    })
  }

  const ExitsEmail=await userSchema.findOne({email})
  if(ExitsEmail){
    return res.status(200).json({
        successL:false,
        message:"Account already exits"
    })
  }

  try{
       const user=await userSchema.create({name,email,password})
       if(!user){
        return res.status(200).json({
           success:false,
           message:"user not created"
        })
       }

       await user.save()
       return res.status(200).json({
        success:true,
        message:"successfully register",
        data:user
       })
  }catch(e){
    return res.status(400).json({
        successs:false,
        message:e.message
    })
  }
}
const LoginCtrl=async(req,res)=>{
   const {email,password}=req.body

   if(!email || !password){
    return res.status(200).json({
      success:false,
      message:"email and password are required"
    })
   }

   try{
        const user=await userSchema.findOne({email}).select('+password')
        if(!user || !(await bcrypt.compare(password,user.password))){
           return res.status(200).json({
            success:false,
            message:"invalied credentials"
           })
        }

        const token=user.jwtToken()
        const cookieOption={
          maxAge:24*60*60*1000,
          httpOnly:true
        }

        res.cookie('token',token,cookieOption)

        return res.status(200).json({
          success:true,
          message:"Login successfully",
          data:user,
          token
        })
   }catch(e){
    return res.status(400).json({
      success:false,
      message:e.message
    })
   }
}

const userData=async(req,res)=>{
  const userId=req.user.id
  
  try{
    const user=await userSchema.findById(userId)
    if(!user){
      return res.status(200).json({
        success:false,
        message:"User not found"
      })
    }else{
      return res.status(200).json({
        success:true,
        data:user
      })
    }
  }catch(e){
    return res.status(400).json({
      success:false,
      message:e.message
    })
  }
}

const Logout=(req,res,next)=>{
  const cookieOption={
    expires:new Date(),
    httpOnly:true
  }
  try{
      res.cookie('token',null,cookieOption)

      return res.status(200).json({
        success:true,
        message:"Logged Out"
      })
  }catch(e){
    return res.status(400).json({
      success:false,
      message:e.message
    })
  }
}

const applyDoctor=async(req,res)=>{
  try{
    const {firstname,lastname,phone,email,website,address,specification,experience,feesPerConsaltation,timings}=req.body
    console.log(req.body)
    if(!firstname || !lastname || !phone || !email || !address || !specification || !experience || !feesPerConsaltation || !timings){
      return res.status(200).json({
        success:false,
        message:"All fields are reqired"
      })
    }

    const exitsEmail=await doctorSchema.findOne({email})
    if(exitsEmail){
      return res.status(200).json({
        success:false,
        message:"Account already exits"
      })
    }
  
     const newDoctor=await doctorSchema({...req.body,status:'pending'})
     await newDoctor.save()

    const adminUser=await userSchema.findOne({isAdmin:true})
    const notification=await adminUser.notification

   notification.push({
       type:'apply-doctor-request',
       message:`${newDoctor.firstname} ${newDoctor.lastname} has applied for a Doctor account`,
       data:{
        doctorId:newDoctor._id,
        name:newDoctor.firstname +" "+ newDoctor.lastname,
        onClickPath:' /admin/doctors'
       }
    })

    await userSchema.findByIdAndUpdate(adminUser._id,{notification})

    return res.status(200).json({
      success:true,
      message:"succesfully applied for doctor"
    })
  }catch(e){
    return res.status(400).json({
      success:false,
      message:e.message
    })
  }


}

const getAllNotification=async(req,res) => {
  try{
       const {userId}=req.body
       const User =await userSchema.findOne({_id:userId})
       const seenNotification= await User.seenNotification
       const notification= await User.notification
       await seenNotification.push(...notification)
       User.notification=[]
       User.seenNotification=notification

       const updateUser=await User.save()

       return res.status(200).json({
        success:true,
        message:"all notification marked read",
        data:updateUser
       })
  }catch(e){
    return res.status(400).json({
      success:false,
      message:e.messsage
    })
  }
}

const DeleteAllNotification=async(req,res)=>{
  try{
      const {userId}=req.body
      const user=await userSchema.findOne({_id:userId})
      user.notification=[]
      user.seenNotification=[]
      const updateUser=await user.save()
      updateUser.password=undefined

      return res.status(200).json({
        success:true,
        message:'Notification Deleted successfully',
        data:updateUser
      })
  }catch(e){
    return res.status(400).json({
      success:false,
      message:e.message
    })
  }
}

const getAllDoctor=async(req,res)=>{
  try{
       const doctors=await doctorSchema.find({status:'approved'})
       return res.status(200).json({
        success:true,
        message:"successfully get all doctor",
        data:doctors
       })
  }catch(e){
    return res.status(400).json({
      success:false,
      message:e,
      message:"failed to fatched all Doctor"
    })
  }
}


const bookAppointment=async(req,res)=>{
  try{

      const {userId,doctorId,doctorInfo,userInfo,date,status,time}=req.body
      if(!userId || !doctorId || !doctorInfo || !userInfo || !date  || !time)
      {
        return res.status(200).json({
          success:false,
          message:"all fields are required"
        })
      }
       req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
       req.body.time = moment(req.body.time, "HH:mm").toISOString();
       req.body.status='pending'
       const newAppointment=new appointmentSchema(req.body)
       await newAppointment.save()
       const user=await userSchema.findOne({_id:req.body.doctorInfo.userId})
       user.notification.push({
        type:"New-appointment-request",
        message:`A new appointment request from ${req.body.userInfo.name}`,
        onClickPath:'/user/appointmnets'
       })

       await user.save()
       return res.status(200).json({
        success:true,
        message:"Appointment Book successfully"
       })
  }catch(e){
    return res.status(400).json({
      success:false,
      message:e
    })
  }
}

const checkAvailability = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await appointmentSchema.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });
    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointments not Availibale at this time",
        success: true,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Appointments available",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Booking",
    });
  }
}

const userAppointment=async(req,res)=>{
 try{
     console.log(req.body.userId)
     const appointment=await appointmentSchema.find({userId:req.body.userId})
     return res.status(200).json({
      success:true,
      message:"user appointment fatch successfully",
      data:appointment
     })
 }catch(e){
  return res.status(400).json({
    success:false,
    message:e.message
  })
 }
}


module.exports={LoginCtrl,RegisterCtrl,userData,Logout,applyDoctor,getAllNotification,DeleteAllNotification,getAllDoctor,bookAppointment,checkAvailability,userAppointment}