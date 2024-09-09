import express from "express";
import db from "./config/db.js";
import dotenv from 'dotenv';
import cors from "cors"
import { router } from "./routes/authRoute.js";
import { catogoryRoute } from "./routes/category.Route.js";
import { ProductRouter } from "./routes/product.Router.js";
import path from 'path'
import { fileURLToPath } from "url";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use(express.static(path.join(__dirname, "../client/dist")));
app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

const port = process.env.PORT || 7000;
db().then(()=>{
    app.listen(port, () => {
        console.log(`APP listening on port ${port}`);
      });
})
app.use('/api/v1/auth',router)
app.use('/api/v1/catogory',catogoryRoute)
app.use('/api/v1/product',ProductRouter)


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Server Error';
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: message
    });
});
