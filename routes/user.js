const { Mongoose } = require("mongoose");
const Bet = require("../models/Bet");
const User = require("../models/User");
const router = require("express").Router();

// Login user
router.post("/login", async (req, res) => {
  try {
    console.log("cmd - login user\n", req.body);
    const user = await User.findOne({
      email: req.body.email,
    });
    // check if the user exists, then compare between the passwords. if he isn't exists return null
    if (user) {
      user.password === req.body.password
        ? res.status(200).json({ status: "success", user: user })
        : res.status(200).json({
            status: "failed",
            errorMessage:
              "User password is not matching the password in the database.",
            user: null,
          });
    } else {
      res.status(200).json({
        status: "failed",
        errorMessage: "User email does not exists",
        user: null,
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new User
router.put("/register", async (req, res) => {
  try {
    console.log("cmd - register user\n", req.body);
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user) {
      await new User(req.body).save();
      res.status(201).json({ status: "success" });
    } else {
      res.status(200).json({
        status: "failed",
        errorMessage: "User Email is already exists",
      });
    }
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
});

// Get all users
router.get("/all", async (req, res) => {
  try {
    console.log("cmd - get all users\n");
    const users = await User.find();
    users
      ? res.status(200).json({ status: "success", users })
      : res.status(200).json({
          status: "failed",
          errorMessage: "There is no users.",
          users: null,
        });
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
});

// Get User by email
router.get("/:email", async (req, res) => {
  try {
    console.log("cmd - get user\n", req.params.email);
    const user = await User.findOne({
      email: req.params.email,
    });

    user
      ? res.status(200).json({ status: "success", user })
      : res.status(200).json({
          status: "failed",
          errorMessage: "User not found.",
          user: null,
        });
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
});

module.exports = router;
