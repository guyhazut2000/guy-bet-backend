const { Mongoose } = require("mongoose");
const Bet = require("../models/Bet");
const Match = require("../models/SoccerMatch");
const router = require("express").Router();

// Create new Bet
router.put("/create", async (req, res) => {
  try {
    console.log("cmd - create new bet\n", req.body);
    const bet = await Bet.findOne({
      userId: req.body.userId,
      matchId: req.body.matchId,
    });
    const match = await Match.findOne({
      _id: req.body.matchId,
    });
    // check if match exists in db
    if (!match) {
      res.status(200).json({
        status: "failed",
        errorMessage: "Match isn't exists in DB.",
      });
    }
    // compare current and match time.
    const matchTime = new Date(match.date - 60000 * 10);
    const currentTime = new Date();
    if (currentTime > matchTime) {
      res.status(200).json({
        status: "failed",
        errorMessage:
          "Bet is already finished or about to start within 10 minutes.",
      });
      // set new bet
    } else if (!bet) {
      await new Bet(req.body).save();
      res.status(201).json({ status: "success" });
    }
    // update bet
    else {
      await Bet.findOneAndUpdate(
        {
          _id: bet._id,
        },
        {
          homeTeamScore: req.body.homeTeamScore,
          awayTeamScore: req.body.awayTeamScore,
        }
      );
      res.status(201).json({ status: "success" });
    }
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
});

// Update Bet
router.post("/update", async (req, res) => {
  try {
    console.log("cmd - register user\n", req.body);
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user) {
      await new User(req.body).save();
      res.status(201).json({ status: "success" });
    } else {
      res.status(404).json({
        status: "failed",
        errorMessage: "User already exists",
      });
    }
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
});
// Get all Bets by userId
router.post("/all", async (req, res) => {
  try {
    console.log("cmd - get all bets by userId \n", req.body);
    const bets = await Bet.find({
      userId: req.body.id,
    });
    bets
      ? res.status(200).json({ status: "success", bets: bets })
      : res.status(404).json({
          status: "failed",
          errorMessage: "There is no bets for current user id.",
        });
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
});
// Get all Bets
router.get("/all", async (req, res) => {
  try {
    console.log("cmd - get all bets \n", req.body);
    const bets = await Bet.find();
    bets
      ? res.status(200).json({ status: "success", bets: bets })
      : res.status(404).json({
          status: "failed",
          errorMessage: "There is no bets.",
        });
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
});

module.exports = router;
