import mongoose from "mongoose";
const db =async()=>{
    try {
       await mongoose.connect(process.env.db_URL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
        process.exit(1);
    }
}

export default db;