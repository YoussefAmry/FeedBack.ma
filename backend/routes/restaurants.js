import express from "express";
import { createRestaurant, getRestaurant, getAllRestaurants, updateRestaurant, deleteRestaurant } from "../controllers/restaurantController.js";
import Restaurant from "../models/Restaurant.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Configurer le dossier d'upload
const uploadDir = path.join(process.cwd(), "uploads", "logos");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurer multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Nom unique: restaurantId-timestamp.ext
    const ext = path.extname(file.originalname);
    cb(null, req.params.id + "-" + Date.now() + ext);
  }
});
const upload = multer({ storage });

// Route d'upload du logo
router.post("/:id/logo", upload.single("logo"), async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ msg: "Aucun fichier envoyé" });
    // Mettre à jour le champ logo du restaurant
    const restaurant = await Restaurant.findByIdAndUpdate(
      id,
      { logo: req.file.filename },
      { new: true, runValidators: true }
    ).select("-passwordHash");
    if (!restaurant) return res.status(404).json({ msg: "Restaurant non trouvé" });
    res.json({ msg: "Logo uploadé", logo: req.file.filename, restaurant });
  } catch (err) {
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
});

// Création (setup initial)
router.post("/", createRestaurant);

// Infos publiques
router.get("/:id", getRestaurant);

// Liste de tous les restaurants (superadmin)
router.get("/", getAllRestaurants);

// Update d'un restaurant (superadmin)
router.put("/:id", updateRestaurant);

// Suppression d'un restaurant (superadmin)
router.delete("/:id", deleteRestaurant);

export default router; 