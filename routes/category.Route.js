import { Router } from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { createCategoryController, deleteCategoryController, getAllCategoriesController, GetSingleCategoryController, updateCategoryController } from "../controllers/categoryController.js";
export const catogoryRoute =Router()
catogoryRoute.post("/create-category",requireSignIn,isAdmin,createCategoryController)
catogoryRoute.put("/update-category/:id",requireSignIn,isAdmin,updateCategoryController)
catogoryRoute.get("/get-category",getAllCategoriesController)
catogoryRoute.delete("/delsingle-category/:id",deleteCategoryController)
catogoryRoute.get("/getsingle-category/:slug",requireSignIn,isAdmin,GetSingleCategoryController)




