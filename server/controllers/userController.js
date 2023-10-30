import User from "../models/userModel.js";
import AppError from "../utilis/errorUtil.js";

const cookieOptions ={
    maxAge:7 * 24 * 60 * 60 * 1000,//7 days
    httpOnly: true,
    secure:true
}




const register =async (req,res,next)=>{
    const { fullName,email,password} =req.body;
   
    if(!fullName || !email || !password)
    {
        return next(new AppError('All Fields are Required',400));
    }

    const userExists =await User.findOne({email});

    if(userExists)
    {
        return next(new AppError('Email already exists',400));
    }
    const user = await User.create({
        fullName,
        email,
        password,
        avatar:{
            public_id:email,
            secure_url:
            'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',

        },
    })

    if(!user){
       return  next(new AppError('User registration Failed,please try again Later',400));
    }


   //ToDo :File upload

   await user.save();
  user.password = undefined;
   
   const token = await user.generateJWTToken();
  
  res.cookie('token',token,cookieOptions);


  return res.status(200).json({
    success:true ,
    message:'User registered Successfully',
    user,
   })




};

const login = async (req,res,next)=>{


   try{
    const {email,password} =req.body;
    if(!email || !password){
        return  next(new AppError('All Fields are required',400));
    }

    const user = await User.findOne({
        email
    }).select('+password');

    if(!user || !user.comparePasswords(password)){
        return  next(new AppError('Emails and password does not match',400));
    }

    const token = await user.generateJWTToken();

    user.password= undefined;

    res.cookie('token',token,cookieOptions);
    
    return res.status(200).json({
        success:true,
        message:"USer Looged in sucessfully",
        user,
    });

   }catch(e){
    return  next(new AppError(e.message,500));
   }


};





const logout = (req,res) =>{

    res.cookie('token',null,{
        secure:true,
        maxAge:0,
        httpOnly:true
    });

    res.status(200).json({
        sucess:true,
        message:'User logged out Sucessfully'
    })


};




const getProfile = async (req,res) =>{
  try{
    const userId=req.user.id;
   const user = await User.findById(userId);
    res.status(200).json({
        success: true,
        message:'User details',
        user
    })
}
catch(e){
    return  next(new AppError('Failed to fetch profile detail',500));
}
   

};




export {
    register,
    login,
    logout,
    getProfile

}


