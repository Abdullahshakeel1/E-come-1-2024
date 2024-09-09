import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
name:{
    required: true,
    type: String,
},
slug:{
    lowercase: true,
    type: String,
}

})

export const Category= mongoose.model('Category', categorySchema);