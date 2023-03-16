const User = require("../models/User");
const Game = require("../models/Game");
const { isObjectId } = require("../utils/MongoObject");
const {
  SoccerBet,
  MatchUp,
  NextRoundWinner,
  TopScorer,
  TournamentWinner,
} = require("../models/SoccerBet");

/**
 *  @description Get all soccer bets.
 *  @method GET
 *  @access private
 */
const getAll = async (req, res) => {
  try {
    // get all games
    const bets = await SoccerBet.find();

    if (!bets || bets.length === 0) {
      return res.status(404).json({
        message: "There is no bets in DB.",
      });
    }

    return res.status(200).json(bets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 *  @description Update bet.
 *  @method POST
 *  @access private
 */
const update = async (req, res) => {
  const { betId, type } = req.body;

  // confirm request inputs
  if (!betId) {
    return res.status(400).json({ message: "Missing betId input." });
  }

  if (!type) {
    return res.status(400).json({ message: "Missing type input." });
  }

  // confirm request inputs
  if (!isObjectId(betId)) {
    return res
      .status(400)
      .json({ message: `Bet Id - ${betId}is not typeof Object ID!` });
  }

  try {
    //get bet
    const bet = await SoccerBet.findById({ _id: betId });

    //check if bet exists
    if (!bet)
      return res
        .status(404)
        .json({ message: `Bet with betId-${betId} doesn't exists.` });

    //check if bet finished
    if (bet.status !== "live")
      return res.status(409).json({ message: "Bet is already finished" });

    let updatedBet = {};

    // update bet based on bet type.
    if (type === "match_up") {
      const { homeTeamScore, awayTeamScore, prediction } = req.body;

      if (!homeTeamScore || !awayTeamScore || !prediction)
        return res.status(400).json({
          message:
            "All inputs (homeTeamScore, awayTeamScore, prediction) are required.",
        });

      // update bet
      updatedBet = await MatchUp.findOneAndUpdate({ _id: betId }, req.body);

      if (updatedBet)
        return res.status(200).json({ message: "Bet updated successfully." });
      return res.status(400).json({ message: `Failed to update bet.` });
    }
    if (type === "next_round_winner") {
      const { prediction } = req.body;

      if (!prediction)
        return res.status(400).json({
          message: "Prediction field is required!",
        });

      // check if bet exists
      const bet = await NextRoundWinner.findOne({ _id: betId });

      if (!bet) return res.status(404).json({ message: "Bet doesn't exists." });

      //check if match_up between the teams already finished
      if (bet.status === "finished")
        return res.status(409).json({
          message: `Match-up between ${bet.firstTeamName} and ${bet.secondTeamName} is already finished.`,
        });

      // update bet
      updatedBet = await NextRoundWinner.findOneAndUpdate(
        { _id: betId },
        { prediction }
      );

      if (updatedBet)
        return res.status(200).json({ message: "Bet updated successfully." });
      return res.status(400).json({ message: `Failed to update bet.` });
    }
    if (type === "top_scorer") {
      const { playerName } = req.body;

      if (!playerName)
        return res.status(400).json({
          message: "playerName input is required.",
        });

      // update bet
      updatedBet = await TopScorer.findOneAndUpdate(
        { _id: betId },
        { playerName }
      );

      if (updatedBet)
        return res.status(200).json({ message: "Bet updated successfully." });
      return res.status(400).json({ message: `Failed to update bet.` });
    }
    if (type === "tournament_winner") {
      const { teamName } = req.body;

      if (!teamName)
        return res.status(400).json({
          message: "teamName input is required.",
        });

      //check if teamName exists in tournament teams
      const tournamentGames = await Game.find()
        .limit(8)
        .select("homeTeamName awayTeamName -_id");

      let isTeamExists = false;
      tournamentGames.forEach((team) => {
        if (team.homeTeamName === teamName || team.awayTeamName === teamName) {
          isTeamExists = true;
        }
      });

      if (!isTeamExists)
        return res.status(400).json({
          message: `Team ${teamName} isn't part of the tournament teams`,
        });

      // update bet
      updatedBet = await TournamentWinner.findOneAndUpdate(
        { _id: betId },
        { teamName }
      );

      if (updatedBet)
        return res.status(200).json({ message: "Bet updated successfully." });
      return res.status(400).json({ message: `Failed to update bet.` });
    }

    res.status(400).json({ message: `Type ${type} is not a valid bet type` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 *  @description Get all soccer bets by userId.
 *  @method POST
 *  @access private
 */
const getAllByUserId = async (req, res) => {
  const { userId } = req.body;

  // confirm request inputs
  if (!userId) {
    return res.status(400).json({ message: "UserId is required!" });
  }

  // confirm valid ObjectId
  if (!isObjectId(userId)) {
    return res.status(400).json({ message: "User ObjectId is not valid" });
  }

  try {
    // get all games
    const bets = await SoccerBet.find({ userId }).sort("type");

    if (!bets || bets.length === 0) {
      return res.status(404).json({
        message: `There is no bets in DB for User Id ${userId}.`,
      });
    }

    return res.status(200).json(bets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 *  @description Get soccer bet by bet id.
 *  @method POST
 *  @access private
 */
const getById = async (req, res) => {
  const { betId } = req.body;

  // confirm request inputs
  if (!betId) {
    return res.status(400).json({ message: "Bet Id is required!" });
  }

  // confirm request inputs
  if (!isObjectId(betId)) {
    return res
      .status(400)
      .json({ message: `Bet Id - ${betId}is not typeof Object ID!` });
  }

  try {
    // get game
    const bet = await SoccerBet.find({ _id: betId });

    if (!bet) {
      return res.status(404).json({
        message: `Bet with Id ${betId} is not exists in DB.`,
      });
    }

    return res.status(200).json(bet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 *  @description Create new bet.
 *  @method PUT
 *  @access private
 */
const create = async (req, res) => {
  const { userId, type } = req.body;

  //confirm user and bet type
  if (!userId || !type)
    return res
      .status(400)
      .json({ message: "Both userId and type are required!" });

  // confirm valid ObjectId
  if (!isObjectId(userId)) {
    return res
      .status(400)
      .json({ message: `userId - ${userId} is not typeof ObjectID` });
  }

  try {
    // check if user exists
    const user = await User.findById({ _id: userId });

    if (!user)
      return res
        .status(400)
        .json({ message: `User with userId ${userId} doesn't exists.` });

    // create new bet based on bet type
    if (type === "match_up") {
      let {
        homeTeamName,
        awayTeamName,
        homeTeamScore,
        awayTeamScore,
        gameId,
        prediction,
      } = req.body;

      // confirm request input fields
      if (
        !homeTeamName ||
        !awayTeamName ||
        !homeTeamScore ||
        !awayTeamScore ||
        !gameId ||
        !prediction
      )
        return res.status(400).json({ message: "All fields are required!" });

      // confirm valid ObjectId
      if (!isObjectId(gameId)) {
        return res
          .status(400)
          .json({ message: `gameId - ${gameId} is not typeof ObjectID` });
      }

      // check if game exists in DB.
      const game = await Game.findOne({
        _id: gameId,
      });

      if (!game)
        return res
          .status(404)
          .json({ message: `Game with gameId ${gameId} doesn't exists` });

      // check if bet exists in DB.
      const newBet = await MatchUp.findOne({
        gameId,
        userId,
      });

      if (newBet)
        return res
          .status(409)
          .json({ message: `Bet with id ${gameId} already exists` });

      // compare current and game time.
      const FIFTEEN_MINUTES = 60000 * 15;
      const gameTime = new Date(game.date - FIFTEEN_MINUTES);
      const currentTime = new Date();

      if (currentTime > gameTime) {
        return res.status(400).json({
          message:
            "Bet is already finished or about to start within 15 minutes.",
        });
      }

      // create new match_up bet
      await new MatchUp({
        userId,
        type,
        gameId,
        homeTeamName,
        awayTeamName,
        homeTeamScore,
        awayTeamScore,
        prediction,
      }).save();

      return res.status(201).json({ message: "Bet created successfully." });
    }
    if (type === "next_round_winner") {
      let { firstTeamName, secondTeamName, prediction } = req.body;

      if (!firstTeamName || !secondTeamName || !prediction)
        return res.status(400).json({ message: "All fields are required!" });

      // check if bet already exists
      const bet = await NextRoundWinner.findOne({
        userId,
        type,
        firstTeamName,
        secondTeamName,
      });

      if (bet)
        return res.status(409).json({ message: "Bet is already exists." });

      //get both match up games
      let firstMatch = await Game.findOne({
        homeTeamName: firstTeamName,
        awayTeamName: secondTeamName,
      });

      let secondMatch = await Game.findOne({
        homeTeamName: secondTeamName,
        awayTeamName: firstTeamName,
      });

      // check if both match exists
      if (!firstMatch || !secondMatch)
        return res.status(404).json({
          message: `Game ${firstTeamName} - ${secondTeamName} doesn't exists.`,
        });

      //check if both match_up between the teams already finished
      if (
        firstMatch?.status === "finished" &&
        secondMatch?.status === "finished"
      )
        return res.status(409).json({
          message: `Match-up between ${firstTeamName} and ${secondTeamName} is already finished.`,
        });

      // create new match_up bet
      await new NextRoundWinner({
        userId,
        type,
        firstTeamName,
        secondTeamName,
        prediction,
      }).save();
      return res.status(201).json({ message: "Bet created successfully." });
    }
    if (type === "top_scorer") {
      const { playerName } = req.body;

      // validate input fields
      if (!playerName)
        return res.status(400).json({ message: "All fields are required!" });

      // check if there is already existing bet
      const topScorerBet = await SoccerBet.findOne({
        userId,
        type,
      });

      if (topScorerBet)
        return res.status(409).json({
          message: `There is already an existing bet. (bet limit - 1)`,
        });

      // create new match_up bet
      await new TopScorer({
        userId,
        type,
        playerName,
      }).save();
      return res.status(201).json({ message: "Bet created successfully." });
    }

    if (type === "tournament_winner") {
      const { teamName } = req.body;
      if (!teamName)
        return res.status(400).json({ message: "All fields are required!" });

      //check if teamName exists in tournament teams
      const tournamentGames = await Game.find()
        .limit(8)
        .select("homeTeamName awayTeamName -_id");

      let isTeamExists = false;
      tournamentGames.forEach((team) => {
        if (team.homeTeamName === teamName || team.awayTeamName === teamName) {
          isTeamExists = true;
        }
      });

      if (!isTeamExists)
        return res.status(400).json({
          message: `Team ${teamName} isn't part of the tournament teams`,
        });

      // check if there is already existing bet
      const tournamentWinnerBet = await SoccerBet.findOne({
        userId,
        type,
      });

      if (tournamentWinnerBet)
        return res.status(409).json({
          message: `There is already an existing bet. (bet limit - 1)`,
        });

      // create new match_up bet
      await new TournamentWinner({
        userId,
        type,
        teamName,
      }).save();
      return res.status(201).json({ message: "Bet created successfully." });
    }
    return res
      .status(400)
      .json({ message: `Type ${type} is not a valid type.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 *  @description Create new bets by admin.
 *  @method POST
 *  @access private
 */
const createByAdmin = async (req, res) => {
  // Create new Bets by admin
  try {
    // await MatchUp.insertMany(req.body);
    // await NextRoundWinner.insertMany(req.body);
    // await TopScorer.insertMany(req.body);
    await TournamentWinner.insertMany(req.body);

    res.status(201).json({ status: "success" });
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
};

module.exports = {
  getAll,
  create,
  getAllByUserId,
  update,
  getById,
  createByAdmin,
};
