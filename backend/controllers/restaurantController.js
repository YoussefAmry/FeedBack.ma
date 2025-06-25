import Restaurant from "../models/Restaurant.js";
import bcrypt from "bcryptjs";

// Création d'un restaurant
export const createRestaurant = async (req, res) => {
  const { name, ownerEmail, password, location } = req.body;
  try {
    let restaurant = await Restaurant.findOne({ ownerEmail });
    if (restaurant) return res.status(400).json({ msg: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    restaurant = new Restaurant({ name, ownerEmail, passwordHash, location });
    await restaurant.save();
    res.json({ msg: "Restaurant created", restaurant: { id: restaurant.id, name } });
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// Infos d'un restaurant (public)
export const getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).select("-passwordHash");
    if (!restaurant) return res.status(404).json({ msg: "Not found" });
    res.json(restaurant);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// Liste de tous les restaurants (superadmin)
export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().select("-passwordHash");
    res.json(restaurants);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// Update d'un restaurant (superadmin)
export const updateRestaurant = async (req, res) => {
  const { id } = req.params;
  const { name, ownerEmail, password, location } = req.body;
  try {
    const update = { name, ownerEmail, location };
    if (password) {
      update.passwordHash = await bcrypt.hash(password, 10);
    }
    const restaurant = await Restaurant.findByIdAndUpdate(id, update, { new: true, runValidators: true }).select("-passwordHash");
    if (!restaurant) return res.status(404).json({ msg: "Not found" });
    res.json({ msg: "Restaurant updated", restaurant });
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// Suppression d'un restaurant (superadmin)
export const deleteRestaurant = async (req, res) => {
  const { id } = req.params;
  try {
    const restaurant = await Restaurant.findByIdAndDelete(id);
    if (!restaurant) return res.status(404).json({ msg: "Not found" });
    res.json({ msg: "Restaurant supprimé" });
  } catch (err) {
    res.status(500).send("Server error");
  }
};