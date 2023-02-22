const mongoose = require("mongoose");

const BetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SoccerMatch",
    },
    homeTeamName: { type: String, required: true },
    awayTeamName: { type: String, required: true },
    homeTeamScore: { type: String, required: true },
    awayTeamScore: { type: String, required: true },
    score: { type: Number, default: 0, required: true },
  },
  { collection: "bets" },
  { timestamps: true }
);
module.exports = mongoose.model("Bet", BetSchema);
