import jwt from "jsonwebtoken"

const verifyToken=(req,res,next)=>{
    const token=req.headers.authorization?.split(" ")[1];
    if(!token) return res.status(401).json({success:false,message:"Access denied"});
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.user=decoded;
        next();
    }catch(err){
        
        return res.status(403).json({success:false,message:"Invalid token"});
    }

}

export default verifyToken;