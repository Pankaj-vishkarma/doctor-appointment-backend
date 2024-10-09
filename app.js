const express=require('express')
const app=express()
require('dotenv').config()
const database=require('./database/database.js')
const userRouter=require('./route/userRoutes.js')
const cors=require('cors')
const cookieparser=require('cookie-parser')
const adminRoute=require('./route/adminRoute.js')
const doctorRoute=require('./route/doctorRoute.js')

database()

app.use(cors({
    origin:['http://localhost:5173'],
    methods:['GET','POST'],
    credentials:true
}))
app.use(cookieparser())
app.use(express.json())
app.use('/api/user',userRouter)
app.use('/api/admin',adminRoute)
app.use('/api/doctor',doctorRoute)

module.exports=app