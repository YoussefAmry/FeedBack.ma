import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import path from "path";

import authRoutes from "./routes/auth.js";
import ratingRoutes from "./routes/ratings.js";
import restaurantRoutes from "./routes/restaurants.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: [
    "https://feed-back-99yrgoang-youssef-amrys-projects.vercel.app",
    "https://feed-back-ma.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

// Servir les fichiers statiques (logos)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/restaurants", restaurantRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); 