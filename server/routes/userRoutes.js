import { Router } from "express";
import { register,login,logout,getProfile,forgotPassword,resetPassword,changePassword } from "../controllers/userController.js";
import { isLoggedIn } from "../middlewares/authMiddleware.js";
import  upload  from "../middlewares/multerMiddleware.js";


const router =Router();


///user module done

 




router.post('/register', upload.single("avatar") ,register);

router.post('/login',login);
router.get('/logout',logout);
router.get('/me',isLoggedIn,getProfile);
router.post('/forgot-password',forgotPassword);
router.post('/reset-password/:resetToken',resetPassword);
router.post('/change-password',isLoggedIn,changePassword);
router.put('/update/:id',isLoggedIn,upload.single("avatar"),updateUser);



export default router;
