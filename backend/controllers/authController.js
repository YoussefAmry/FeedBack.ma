import Restaurant from "../models/Restaurant.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const restaurant = await Restaurant.findOne({ ownerEmail: email });
    if (!restaurant) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, restaurant.passwordHash);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const payload = { restaurant: { id: restaurant.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "12h" });

    res.json({ token, restaurant: { id: restaurant.id, name: restaurant.name, logo: restaurant.logo } });
  } catch (err) {
    res.status(500).send("Server error");
  }
}; 