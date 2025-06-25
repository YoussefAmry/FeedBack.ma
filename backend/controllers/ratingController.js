import Rating from "../models/Rating.js";
import Restaurant from "../models/Restaurant.js";
import mongoose from "mongoose";

// Ajout d'un avis (public, multi-critères)
export const addRating = async (req, res) => {
  const { restaurantId } = req.params;
  let { criteria } = req.body;
  if (!criteria || !Array.isArray(criteria) || criteria.length === 0) {
    return res.status(400).json({ msg: "Aucun critère fourni" });
  }
  // Filtrer le critère 'Erreurs de commande'
  criteria = criteria.filter(c => c.label !== "Erreurs de commande");
  try {
    const resto = await Restaurant.findById(restaurantId);
    if (!resto) return res.status(404).json({ msg: "Restaurant not found" });
    const newRating = new Rating({ restaurantId, criteria });
    await newRating.save();
    res.json({ msg: "Merci pour votre avis !" });
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// Stats + liste des avis (admin, multi-critères)
export const getRatings = async (req, res) => {
  const restaurantId = req.restaurant.id;
  try {
    let ratings = await Rating.find({ restaurantId }).sort({ createdAt: -1 });
    // Filtrer le critère 'Erreurs de commande' à l'affichage
    ratings = ratings.map(r => ({
      ...r.toObject(),
      criteria: r.criteria.filter(c => c.label !== "Erreurs de commande")
    }));
    const total = ratings.length;
    // Calcul de la moyenne globale sur tous les critères
    let sum = 0, count = 0;
    ratings.forEach(r => {
      r.criteria.forEach(c => {
        if (c.rating) {
          sum += c.rating;
          count++;
        }
      });
    });
    const average = count > 0 ? (sum / count).toFixed(2) : 0;
    res.json({
      average: Number(average),
      total,
      ratings
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
}; 