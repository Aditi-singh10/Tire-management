const mongoose = require("mongoose");

const BusSchema = new mongoose.Schema(
  {
    busNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    totalSlots: {
      type: Number,
      required: true,
      default: 6,
    },

    status: {
      type: String,
      enum: ["active", "maintenance", "inactive"],
      default: "active",
    },

    emergencyTireCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    
    emergencyTires: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tire",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bus", BusSchema);
