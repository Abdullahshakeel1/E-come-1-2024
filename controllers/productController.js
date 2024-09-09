import fs from 'fs';
import { errorHandler } from '../utils/error.js';
import { Product } from '../models/Product.Model.js';
import slugify from 'slugify';
import { Category } from '../models/category.model.js';
import braintree from 'braintree';
import dotenv from 'dotenv';
import { Order } from '../models/order.Model.js';

dotenv.config();

var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.MERCHANT_ID,
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY,
  });

export const createProductController = async (req, res, next) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        // Validate required fields
        if (!name) return next(errorHandler(400, 'Name must be provided'));
        if (!description) return next(errorHandler(400, 'Description must be provided'));
        if (!price) return next(errorHandler(400, 'Price must be provided'));
        if (!category) return next(errorHandler(400, 'Category must be provided'));
        if (!quantity) return next(errorHandler(400, 'Quantity must be provided'));

        // Validate photo
        if (!photo) return next(errorHandler(400, 'Photo is required'));
        if (photo.size > 1000000) return next(errorHandler(400, 'Photo should be less than 1MB'));

        // Create product
        const product = new Product({
            ...req.fields,
            slug: slugify(name),
        });

        // Handle photo
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }

        // Save product to database
        await product.save();

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product,
        });

    } catch (error) {
        next(error);
    }
};
export const getProductController =async (req, res, next) => {
    try {
        const products = await Product.find({}).populate("category").select("-photo").limit(12).sort({createdAt:-1});
        res.status(200).json({
            Total: products.length,
            success: true,
            message: 'Products fetched successfully',
            products,
          
        });
    } catch (error) {
        next(error);
    }
}
export const getSingleProductController = async (req, res, next) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug }).select("-photo").populate("category");
        if (!product) return next(errorHandler(404, 'Product not found'));
        res.status(200).json({
            success: true,
            message: 'single product successfully',
            product,
        });
    } catch (error){
        next(error);
    }
}

export const getProductPhotoController = async (req, res, next) => {
    try {
        const product = await Product.findById( req.params.pid ).select("photo");
        if (!product ||!product.photo) return next(errorHandler(404, 'Product not found or photo not available'));
      if(product.photo.data){
        res.set('Content-Type', product.photo.contentType);
        res.send(product.photo.data);
      }
      
    } catch (error) {
        next(error);
    }
}
export const deleteProductController = async (req, res, next) => {
    try {
        const productId = req.params.pid;
        const product = await Product.findByIdAndDelete(productId);
        if (!product) return next(errorHandler(404, 'Product not found'));
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};


export const updateProductController = async (req, res, next) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        if (!name || !description || !price || !category || !quantity) {
            return next(errorHandler(400, 'All fields are required'));
        }

        const product = await Product.findById(req.params.pid);
        if (!product) return next(errorHandler(404, 'Product not found'));

        product.name = name;
        product.description = description;
        product.price = price;
        product.category = category;
        product.quantity = quantity;
        product.shipping = shipping;
        product.slug = slugify(name);

        if (photo) {
            if (photo.size > 1000000) return next(errorHandler(400, 'Photo should be less than 1MB'));
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }

        await product.save();

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product,
        });

    } catch (error) {
        next(error);
    }
};
export const filterProductController= async(req,res,next)=>{
    try {
        const {checked, radio}=req.body
        let query = {};
        if(checked.length > 0) query.category =checked
        if(radio.length) query.price = {$gte:radio[0],$lte:radio[1]}
        const products = await Product.find(query)
        res.status(200).json({
            success: true,
            message: 'Products fetched successfully',
            products,
        });
    } catch (error) {
        next(error);
    }
}

export const getProductCountController =async(req,res,next)=>{
    try {
        const total =await Product.find({}).estimatedDocumentCount()
        res.status(200).json({
            success: true,
            total,
        });
    } catch (error) {
        next(error);
    }
}
export const getProductListController =async(req,res,next)=>{
    try {
        const perPage =8;
        const page = req.params.page ? req.params.page:1;
        const products = await Product
        .find({})
        .select("-photo")
        .skip((page - 1)*perPage)
        .limit(perPage)
        .sort({createdAt: -1});
        res.status(200).send({
            success: true,
            products,
          
        })
        
    } catch (error) {
        next(error);
    }
}
export const ProductSearchController = async(req,res,next)=>{
try {
    const {keyword}=req.params
    const result = await Product.find({$or:[
        {name:{$regex:keyword, $options:"i"}},
        {description:{$regex:keyword, $options:"i"}}

    ]}).select("-photo");
    res.json(result);
} catch (error) {
    next(error);
}
}
export const RelatedProductController = async(req,res,next) => {
    try {
        const {pid,cid}=req.params;
        const products = await Product.find({
            category: cid,
            _id: {$ne: pid},
        }).select("-photo").limit(4).populate("category");
        res.status(200).send({
            success: true,
            products,
        })
    } catch (error) {
        next(error);
    }
}

export const getProductCategoryController = async(req,res,next) => {
    try {
        const category = await Category.findOne({slug: req.params.slug});
        const products = await Product.find({category}).populate("category");
        res.status(200).send({
            success: true,
            category,
            products,
        })
    } catch (error) {
     next(error);   
    }
}
export const BraintreeController =async (req,res,next) => {
    try {
        gateway.clientToken.generate({},function(err,response) {
            if (err) next(errorHandler(500,err));
            res.send( response);
        })
        
    } catch (error) {
        console.log(error); 
        next(error)
        
    }
}
export const BraintreePaymentController =async (req,res,next) => {
    try {
        const {cart, nonce } = req.body;
        let total = 0;
        cart.map((i)=>{
            total += i.price
        })
        let newtransaction = gateway.transaction.sale(
            {
                amount: total,
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true
                }
            },
            function (err, result) {
                if(result){
                    const order = new Order({
                        products:cart,
                        payment: result,
                        buyer: req.user._id,
                    }).save()
                    res.json({
                       ok: true,
                    })
                }
                else{
                    next(errorHandler(500,err));
                }
            }
          
       
        )

    } catch (error) {
        console.log(error)
        next(error)
    }
}