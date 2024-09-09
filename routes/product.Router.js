import { Router } from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createProductController,
  deleteProductController,
  getProductPhotoController,
  getProductController,
  getSingleProductController,
  updateProductController,
  filterProductController,
  getProductCountController,
  getProductListController,
  ProductSearchController,
  RelatedProductController,
  getProductCategoryController,
  BraintreeController,
  BraintreePaymentController,
} from "../controllers/productController.js";
import formidable from "express-formidable";

export const ProductRouter = Router();

// Route with a leading slash
ProductRouter.post(
  "/createproduct",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);
ProductRouter.put(
  "/updateproduct/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

ProductRouter.get("/getproduct", getProductController);
ProductRouter.get("/getproduct/:slug", getSingleProductController);
ProductRouter.get("/getphoto/:pid", getProductPhotoController);
ProductRouter.delete("/delproduct/:pid", deleteProductController);
ProductRouter.post("/filterproduct", filterProductController);
ProductRouter.get("/productcount", getProductCountController);
ProductRouter.get("/productlist/:page", getProductListController);
ProductRouter.get("/search/:keyword", ProductSearchController);
ProductRouter.get("/related/:pid/:cid", RelatedProductController);
ProductRouter.get("/productcategory/:slug", getProductCategoryController);
ProductRouter.get("/braintree/token", BraintreeController);
ProductRouter.post("/braintree/payment",requireSignIn, BraintreePaymentController);





