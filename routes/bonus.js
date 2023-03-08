const { Mongoose } = require("mongoose");
const Bonus = require("../models/Bonus");
const User = require("../models/User");
const router = require("express").Router();

// Create new Bonus
router.put("/create", async (req, res) => {
  const { userId } = req.body;

  try {
    // check if user exists
    const user = await User.findOne({ _id: userId });
    console.log(req.body);
    // if user isn't exists send error msg
    if (user === null)
      return res
        .status(400)
        .json({ errorMessage: `user ${userId} isn't exists.` });

    // create new bonus
    await new Bonus(req.body).save();
    res.status(201).json({ status: "success" });
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
});

// Update Bonus
router.post("/update", async (req, res) => {
  const bonusId = req.body._id;

  try {
    // get bonus
    const bonus = await Bonus.findOne({
      _id: bonusId,
    });

    // update bonus
    if (bonus) {
      await Bonus.findByIdAndUpdate(bonusId, {
        score: req.body.score,
      });
    }
    res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
});

// Get all Bonuses by userId
router.post("/all", async (req, res) => {
  try {
    const bonuses = await Bonus.find({
      userId: req.body.userId,
    });
    console.log(bonuses);
    bonuses
      ? res.status(200).json({ status: "success", bonuses: bonuses })
      : res.status(404).json({
          status: "failed",
          errorMessage: `User ${req.body._id} has no bonuses.`,
        });
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
});

module.exports = router;
