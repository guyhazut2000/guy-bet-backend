const mongoose = require("mongoose");

const SoccerBetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "match_up",
        "next_round_winner",
        "top_scorer",
        "tournament_winner",
      ],
      default: "match_up",
    },
    status: {
      type: String,
      enum: ["live", "won", "lose"],
      default: "live",
    },
    score: { type: Number, default: 0 },
  },
  { collection: "soccer_bets" },
  { timestamps: true }
);

const MatchUpSchema = new mongoose.Schema({
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game",
    required: true,
  },
  homeTeamName: { type: String, required: true },
  awayTeamName: { type: String, required: true },
  homeTeamScore: { type: String, required: true },
  awayTeamScore: { type: String, required: true },
  prediction: {
    type: String,
    enum: ["1", "x", "2"],
    required: true,
  },
});

const NextRoundWinnerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  firstTeamName: { type: String, required: true },
  secondTeamName: { type: String, required: true },
  prediction: {
    type: String,
    enum: ["1", "2"],
    required: true,
  },
});

const TopScorerSchema = new mongoose.Schema({
  playerName: { type: String, required: true },
});

const TournamentWinnerSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
});

// discriminator schema
var SoccerBet = mongoose.model("SoccerBet", SoccerBetSchema);
var MatchUp = SoccerBet.discriminator("MatchUp", MatchUpSchema);
var NextRoundWinner = SoccerBet.discriminator(
  "NextRoundWinner",
  NextRoundWinnerSchema
);
var TopScorer = SoccerBet.discriminator("TopScorer", TopScorerSchema);
var TournamentWinner = SoccerBet.discriminator(
  "TournamentWinner",
  TournamentWinnerSchema
);

module.exports = {
  SoccerBet,
  MatchUp,
  NextRoundWinner,
  TopScorer,
  TournamentWinner,
};
