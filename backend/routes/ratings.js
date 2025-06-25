import express from "express";
import { addRating, getRatings } from "../controllers/ratingController.js";
import auth from "../middleware/auth.js";
const router = express.Router();

// Public : ajouter un avis
router.post("/:restaurantId", addRating);

// Admin : voir stats et avis
router.get("/admin", auth, getRatings);

export default router; 