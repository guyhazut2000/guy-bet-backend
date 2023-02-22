const { Mongoose } = require("mongoose");
const Match = require("../models/SoccerMatch");
const router = require("express").Router();

// Create new soccer match
router.put("/create", async (req, res) => {
  try {
    console.log("cmd - create match\n", req.body);
    const match = await Match.findOne({
      homeTeamName: req.body.homeTeamName,
      awayTeamName: req.body.awayTeamName,
    });
    if (match) {
      res
        .status(200)
        .json({ status: "failed", errorMessage: "Match already exists." });
    } else {
      await new Match(req.body).save();
      res.status(201).json({ status: "success" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all soccer matches
router.get("/all", async (req, res) => {
  try {
    console.log("cmd - get all soccer matches\n");
    const matches = await Match.find();
    if (!matches) {
      res.status(200).json({
        status: "failed",
        errorMessage: "There is not soccer matches in DB.",
      });
    } else {
      res.status(200).json({ status: "success", matches: matches });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get match by matchId
router.get("/:matchId", async (req, res) => {
  try {
    console.log("cmd - get match by matchId\n");
    const match = await Match.findOne({ _id: req.params.matchId });
    if (!match) {
      res.status(200).json({
        status: "failed",
        errorMessage: "Match isn't exists in DB.",
      });
    } else {
      res.status(200).json({ status: "success", match });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
