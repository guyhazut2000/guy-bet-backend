const mongoose = require("mongoose");

const SoccerMatchSchema = new mongoose.Schema(
  {
    homeTeamName: { type: String, required: true },
    awayTeamName: { type: String, required: true },
    date: { type: Date, default: Date },
    homeTeamScore: { type: String, default: "0", required: true },
    awayTeamScore: { type: String, default: "0", required: true },
    result: { type: String, enum: ["1", "x", "2", "-"], default: "-" },
  },
  { collection: "matches" },
  { timestamps: true }
);
module.exports = mongoose.model("SoccerMatch", SoccerMatchSchema);
