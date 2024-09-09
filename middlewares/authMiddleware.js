import jwt from "jsonwebtoken";
import User from "../models/user.Model.js";
import { errorHandler } from "../utils/error.js";
 export const requireSignIn = async (req, res, next) =>{
    try {
        const token= req.headers.authorization
        const decode =jwt.verify(token,process.env.JWT_SECRET_KEY, (err, user) => {  // Correct the env var name
            if (err) {
                return next(errorHandler(403, "Forbidden"));
            }

            // Ensure the user has an _id property
            if (!user._id) {
                return next(errorHandler(500, "Invalid token: user ID not found"));
            }

            // Attach user to request object
            req.user = user;
            next();})
    
        
    } catch (error) {
        next(error)
    }
}

//for admin access
export const isAdmin = async (req, res, next) =>{
    try {
        const user = await User.findById(req.user._id)
        if(user.role !== 1){
           next(errorHandler(401,"unauthorized access"))
        }
        next()
        
    } catch (error) {
        next(error)
    }
}