import { Router } from "express";
import 
{
    authAdminOrders,
    authAdminOrdersStatus,
    authOrders,
     forgotPasswordController, 
     loginController,
     registerController,
     updateProfile, 
    //  test,
} 
from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
export const router = Router()
router.post('/signup',registerController)
router.post('/login',loginController )
router.post('/forgot-password',forgotPasswordController )
// router.get('/test',requireSignIn,isAdmin ,test )
router.get('/user-auth',requireSignIn ,(req,res)=>{
    res.status(200).send({ok:true});
} )
router.get('/admin-auth',requireSignIn, isAdmin,(req,res)=>{
    res.status(200).send({ok:true});
} )
router.put('/profile',requireSignIn, updateProfile);
router.get('/orders',requireSignIn, authOrders);
router.get('/adminorders',requireSignIn, isAdmin, authAdminOrders);
router.put('/orderstatus/:orderId',requireSignIn, isAdmin, authAdminOrdersStatus);

