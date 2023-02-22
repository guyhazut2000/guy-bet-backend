const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const userRoute = require("./routes/user");
const betRoute = require("./routes/bet");
const soccerMatchesRoute = require("./routes/soccerMatch");

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connected Successfully!"))
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use(express.json());

app.use("/api/v1/users", userRoute);
app.use("/api/v1/matches", soccerMatchesRoute);
app.use("/api/v1/bets", betRoute);

app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

//start server
app.listen(process.env.PORT || process.env.MONGO_PORT, () => {
  console.log("Backend server is running!");
});
