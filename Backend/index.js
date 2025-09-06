import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ 
  credentials: true, 
  origin: [
    "http://localhost:5173",
    "http://localhost:5174", 
    "http://localhost:5175",
    "http://localhost:3000",
    "http://localhost:5176",
    "http://localhost:5177"
  ] 
}));
app.use(express.json()); // Parse JSON bodies, result in 'req.body'
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies, result in 'req.body'
app.use(cookieParser()); // Parse cookies, result in 'req.cookies'

// Serve static files from public directory
app.use(express.static('public'));

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/profiles", profileRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/carts", cartRoutes);
app.use("/addresses", addressRoutes);
app.use("/orders", orderRoutes);
app.use("/payments", paymentRoutes);
app.use("/wishlists", wishlistRoutes);
app.use("/reviews", reviewRoutes);
app.use("/messages", messageRoutes);
app.use("/notifications", notificationRoutes);

// Serve verification page
app.get('/verify-account', (req, res) => {
  res.sendFile(__dirname + '/public/verify.html');
});

// Handle favicon requests
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // No content
});

// Root route - redirect to frontend
app.get('/', (req, res) => {
  res.redirect('http://localhost:5174/');
});

// Middle to handle uncatched error, yesle server shutdown hunw batw bachauxw
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});