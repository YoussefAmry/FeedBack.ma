import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerEmail: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  location: { type: String },
  logo: { type: String }
});

export default mongoose.model("Restaurant", RestaurantSchema);