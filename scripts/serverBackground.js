const GameController = require("../controllers/gameController");

/**
 * run script every 15 minutes
 * the script will update live bets status and score
 */
let games = [];
let bets = [];
const FIFTEEN_MINUTES = 15 * 60000;

const getAllFinishedGames = async () => {
  console.log("sdf");
  const { bets } = await GameController.getAll();
  console.log(bets);
};

const getAllLiveBets = async () => {};

const updateBet = async () => {};

getAllFinishedGames();
