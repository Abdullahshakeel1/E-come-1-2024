import { Category } from "../models/category.model.js";
import { errorHandler } from "../utils/error.js";
import slugify from "slugify";

export const createCategoryController =async(req , res , next) => {
    try {
        const {name}=req.body
        if(!name) return next(errorHandler(401,"name is required"));
        const existinCategory = await Category.findOne({name})
        if(existinCategory){
            return res.status(200).send({
                success: true,
                message: "Category already exists",
            })
        }
        const category = await new Category ({
            name,
            slug: slugify(name)
        }).save();
        res.status(201).send({
            success: true,
            message: "Category created successfully",
            category
        })
    } catch (error) {
        next(error);
    }
}
export const updateCategoryController =async(req,res,next)=>{
try {
    const {name} = req.body
    const {id} = req.params
    const catogory = await Category.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})
    res.status(200).send({success: true, message:"Category updated successfully", catogory}); 
} catch (error) {
    next(error);
}
}
export const deleteCategoryController = async(req,res,next)=>{
    try {
        const {id} = req.params
        await Category.findByIdAndDelete(id)
        res.status(200).send({success: true, message:"Category deleted successfully"})
    } catch (error) {
        next(error);
    }
}

export const getAllCategoriesController = async(req,res,next)=>{
    try {
        const categories = await Category.find({})
        res.status(200).send({success: true , message:"Category show successfully" ,categories})
    } catch (error) {
        next(error);
        console.log(error)
    }
}
export const GetSingleCategoryController = async(req,res,next)=>{
    try {
    const category = await Category.findOne({slug: req.params.slug})    
    res.status(200).send({success:true , message:"Get Single Category  Successfully" , category})   
    } catch (error) {
        next(error);
    }
}