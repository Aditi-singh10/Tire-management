const mongoose = require("mongoose");

const TireSchema = new mongoose.Schema(
  {
    tireCode: {
      type: String, // A01, A07, A01-R1
      required: true,
      unique: true,
      trim: true,
    },

    originalTireCode: {
      type: String,
      default: null, // filled only if repaired tire
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
