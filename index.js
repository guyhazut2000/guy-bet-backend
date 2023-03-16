// middlewares
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const { logger, logEvents } = require("./middlewares/logger");
// routes
const userRoute = require("./routes/user");
const GameRoute = require("./routes/game");
const SoccerBetRoute = require("./routes/soccerBet");

// connect to mongo DB
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connected Successfully!"))
  .catch((err) => {
    console.log(err);
  });

// middlewares
app.use(logger);
app.use(cors());
app.use(express.json());

// routes
app.use("/api/v1/users", userRoute);
app.use("/api/v1/games", GameRoute);
app.use("/api/v1/bets", SoccerBetRoute);

// wildcard route
app.use("*", (req, res) => res.status(404).json({ error: "Page not found" }));

const PORT = process.env.PORT;

// start listening for requests
app.listen(PORT, () => {
  console.log(`Backend server is running on port - ${PORT}`);
});
