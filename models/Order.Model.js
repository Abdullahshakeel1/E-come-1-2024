import mongoose from "mongoose";
const OrderSchema = new mongoose.Schema({
    products:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }
],
payment:{},
buyer:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
},

status:{
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
}

},{
    timestamps: true,
})

export const Order= mongoose.model('Order', OrderSchema);