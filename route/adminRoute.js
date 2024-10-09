const express=require('express')
const auth = require('../middleware/Authmidle')
const { getAllDoctors, getAllUsers, changeAccountStatusCntrl } = require('../controller/adminCntrl')
const adminRoute=express.Router()

adminRoute.get('/doctors',auth,getAllDoctors)
adminRoute.get('/users',auth,getAllUsers)
adminRoute.post('/chnageaccountstatus',auth,changeAccountStatusCntrl)

module.exports=adminRoute
