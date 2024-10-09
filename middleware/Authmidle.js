const JWT=require('jsonwebtoken')

const auth=(req,res,next)=>{

  const token=(req.cookies && req.cookies.token) || null

  if(!token){
    return res.status(200).json({
        success:false,
        message:"Not Authorised"
    })
  }
  try{
       const paylaod=JWT.verify(token,process.env.SECRET)
       req.user={id:paylaod.id,email:paylaod.email}
       
  }catch(e){
    return res.status(400).json({
        success:false,
        message:e.message
    })
  }
  next()

}

module.exports=auth