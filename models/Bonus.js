const mongoose = require("mongoose");

const BonusSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    info: {
      type: String,
      require: true,
    },
    score: { type: Number, default: 0, required: true },
  },
  { collection: "bonuses" },
  { timestamps: true }
);
module.exports = mongoose.model("Bonus", BonusSchema);
