import jwt from "jsonwebtoken"
import { comparePass, hashPass } from "../helpers/HassPassword.js"
import User from "../models/user.Model.js"
import { errorHandler } from "../utils/error.js"
import { Order } from "../models/order.Model.js";

// Register new user
export const registerController = async (req, res, next) => {
    try {
        const { name, email, password, phone, address, role, answer } = req.body;

        if (!name) return next(errorHandler(400, "Name is required"));
        if (!email) return next(errorHandler(400, "Email is required"));
        if (!password) return next(errorHandler(400, "Password is required"));
        if (!phone) return next(errorHandler(400, "Phone is required"));
        if (!address) return next(errorHandler(400, "Address is required"));
        if (!answer) return next(errorHandler(400, "answer is required"));

        const existingUser = await User.findOne({ email });
        if (existingUser) return next(errorHandler(400, "Email already exists"));

        const hashPassword = await hashPass(password);
        const newUser = await User.create({
            name,
            email,
            password: hashPassword,
            phone,
            address,
            answer,
            role
        });
        await newUser.save();
        res.status(201).json({
            message: "User registered successfully",
            user: newUser
        });

    } catch (error) {
        next(error);
    }
};


// Login existing user
export const loginController =async(req, res ,next)=>{
    try {
        const {email, password}=req.body
        if(!email ||!password){
            return next(errorHandler(400, "email and password are required"))
        }
        const user = await User.findOne({email})
        if(!user){
            return next(errorHandler(401, "Invalid email"))
        }
        const matchPassword = await comparePass(password, user.password)
        if(!matchPassword){
            return next(errorHandler(401, " password does not match"))
        }
        const token = jwt.sign({_id:user._id},process.env.JWT_SECRET_KEY,{expiresIn:"7d"} )
        res.status(200).send({
            message: "Logged in successfully",
            user:{
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role : user.role

            },
            token: token,

        })

        
    } catch (error) {
        next(error)
        
    }
}
// export const test =(req,res)=>{
//     res.json( "test route")
// }
export const forgotPasswordController = async (req, res, next) => {
    try {
        const { email, answer, newPassword } = req.body;

        if (!email) return next(errorHandler(400, "Email is required"));
        if (!answer) return next(errorHandler(400, "Answer is required"));
        if (!newPassword) return next(errorHandler(400, "New password is required"));

        const user = await User.findOne({ email, answer });
        if (!user) {
            return next(errorHandler(400, "Wrong email or answer"));
        }

        // Ensure hashPass is awaited
        const hashpassword = await hashPass(newPassword);

        await User.findByIdAndUpdate(user._id, { password: hashpassword });

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        next(error);
    }
}

export const updateProfile =async (req, res, next) => {
    try {
      const { name, email, password, phone, address } = req.body;
      const user = await User.findById(req.user._id);
  
      // Check if password is provided and its length
      if (password && password.length < 6) {
        return next(errorHandler(400, "Password must be at least 6 characters long"));
      }
  
      // Prepare the update data
      const updateData = {
        name: name || user.name,
        email: email || user.email,
        password: await hashPass(password) || user.password,

        phone: phone || user.phone,
        address: address || user.address
      };
  
      // Hash the password if it's provided
   
  
      // Update the user profile
      const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, { new: true });
  
      // Send the response
      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        updateUser: updatedUser
      });
  
    } catch (error) {
      // Pass the error to the next middleware (error handler)
      next(error);
    }
  };
  export const authOrders =async (req, res, next) =>{
    try {
        const orders = await Order
          .find({ buyer: req.user._id })
          .populate("products","-photo") // Make sure 'products' is correct
          .populate("buyer", "name");
        res.json(orders);
      } catch (error) {
        next(error); // Handle errors properly
      }
    };

    export const authAdminOrders =async (req,res,next)=>{
      try {
        const orders = await Order
          .find({})
          .populate("products","-photo") // Make sure 'products' is correct
          .populate("buyer", "name")
          .sort({ createdAt: -1 }); 
        res.json(orders);
      } catch (error) {
        next(error); // Handle errors properly
      }
    }
    export const authAdminOrdersStatus =async (req, res, next) => {
      try {
        const { orderId } = req.params;
        const { status } = req.body;
    
        // Validate the input
        if (!orderId || !status) {
          return res.status(400).json({ error: 'Order ID and status are required' });
        }
    
        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    
        if (!order) {
          return res.status(404).json({ error: 'Order not found' });
        }
    
        res.json(order);
      } catch (error) {
        next(error); // Pass errors to the global error handler
      }
    };