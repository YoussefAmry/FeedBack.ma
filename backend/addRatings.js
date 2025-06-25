import mongoose from "mongoose";
import dotenv from "dotenv";
import Rating from "./models/Rating.js";
import Restaurant from "./models/Restaurant.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const CRITERIA = [
  "Qualité des boissons",
  "Qualité des plats",
  "Service",
  "Temps d'attente",
  "Propreté des locaux",
  "Hygiène alimentaire",
  "Prix de vente",
  "Problèmes de commande"
];

const sampleRatings = [
  { date: "2022-01-15", values: [5,4,5,4,5,5,4,4] },
  { date: "2022-02-10", values: [4,3,4,3,4,4,3,3] },
  { date: "2023-03-20", values: [3,5,4,5,3,4,5,4] },
  { date: "2023-07-05", values: [5,5,5,5,5,5,5,5] },
  { date: "2024-01-12", values: [2,2,3,2,2,3,2,2] },
  { date: "2024-06-24", values: [4,4,4,4,4,4,4,4] }
];

async function addSampleRatings() {
  await mongoose.connect(MONGO_URI);
  const resto = await Restaurant.findOne({ name: "Café Paris" });
  if (!resto) throw new Error("Restaurant non trouvé");

  for (const r of sampleRatings) {
    const criteria = CRITERIA.map((label, i) => ({ label, rating: r.values[i], comment: "" }));
    const rating = new Rating({
      restaurantId: resto._id,
      criteria,
      createdAt: new Date(r.date)
    });
    await rating.save();
    console.log(`Ajouté pour ${r.date}`);
  }
  await mongoose.disconnect();
}

addSampleRatings(); 