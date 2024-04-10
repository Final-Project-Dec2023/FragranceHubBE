import express from "express";
import dotenv from "dotenv";
// import cors from "cors";
// import helmet from "helmet";
import morgan from "morgan";
import { connectDB } from "./src/db.config.js";
import authRouter from "./src/routes/auth.js";
import categoryRouter from "./src/routes/category.js";
import productRouter from "./src/routes/product.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
const dbUrl = process.env.MONGODB_URI;

// Middleware
app.use(express.json());
// app.use(cors()); 
// app.use(helmet()); 
app.use(morgan("dev"));



// Connect to DB
connectDB(dbUrl);

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/product", productRouter);



app.listen(port, () => {
  console.log(`Fragrance Hub Server listening on port ${port}`);
});