const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema(
  {
    homeTeamName: { type: String, required: true },
    awayTeamName: { type: String, required: true },
    date: { type: Date, default: Date, required: true },
    homeTeamScore: { type: String, default: "0", required: true },
    awayTeamScore: { type: String, default: "0", required: true },
    result: { type: String, enum: ["1", "x", "2", "-"], default: "-" },
    status: { type: String, enum: ["live", "finished"], default: "live" },
  },
  { collection: "soccer_games" },
  { timestamps: true }
);
module.exports = mongoose.model("Game", GameSchema);
