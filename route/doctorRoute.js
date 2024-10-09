const express=require('express')
const router=express.Router()
const {getDoctorInfo, updateProfile, getSingleDoctor, DoctorAppointment, statusChnage}=require('../controller/doctorCntrl')
const auth = require('../middleware/Authmidle')

router.post('/getdoctorinfo',auth,getDoctorInfo)
router.post('/updateprofile',auth,updateProfile)
router.post('/getsingledoctor',auth,getSingleDoctor)
router.post('/doctor-appointment',auth,DoctorAppointment)
router.post('/status-change',auth,statusChnage)

module.exports=router