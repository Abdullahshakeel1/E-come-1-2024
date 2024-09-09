import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name:{
        required: true,
        type: String,

    },
    email:{
        required: true,
        type: String,
        // unique: true,
        // lowercase: true,
        // match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    },
    password:{
        
        required: true,
        type: String,
        // minlength: 8,

    },
    phone:{
        type: String,
        // unique: true,
        // match: /^\d{10}$/
    },
    address:{
        required: true,
        type: {},
        // minlength: 10,
        // maxlength: 200,

    },
    answer:{
        type:String,
        required: true,
    },
     role: { 
        type: Number,
         default: 0 
        }

},
{
    timestamps: true,
    versionKey: false
})

const User = mongoose.model('User', userSchema);

export default User;