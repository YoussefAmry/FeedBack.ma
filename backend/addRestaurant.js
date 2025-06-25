import mongoose from "mongoose";
import dotenv from "dotenv";
import Restaurant from "./models/Restaurant.js";
import bcrypt from "bcryptjs";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function addRestaurant({ name, ownerEmail, password, location }) {
  await mongoose.connect(MONGO_URI);
  const passwordHash = await bcrypt.hash(password, 10);
  const restaurant = new Restaurant({ name, ownerEmail, passwordHash, location });
  await restaurant.save();
  console.log("Restaurant ajouté :", restaurant);
  await mongoose.disconnect();
}

// Modifie ces valeurs pour ton restaurant
addRestaurant({
  name: "Café Paris",
  ownerEmail: "paris@cafe.com",
  password: "motdepasse",
  location: "Paris"
}); 