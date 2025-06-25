import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  criteria: [
    {
      label: String,
      rating: { type: Number, min: 1, max: 5 },
      comment: String
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Rating", RatingSchema); 