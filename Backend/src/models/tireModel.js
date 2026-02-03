const mongoose = require("mongoose");

const TireSchema = new mongoose.Schema(
  {
    tireCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    maxLifeKm: {
      type: Number,
      required: true,
    },

    currentLifeKm: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "available",
        "mounted",
        "maintenance",
        "punctured",
        "expired",
        "repaired",
        "scrapped",
      ],
      default: "available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tire", TireSchema);
