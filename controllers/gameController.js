const Game = require("../models/Game");
const { isObjectId } = require("../utils/MongoObject");
/**
 *  @description Get all soccer games.
 *  @method GET
 *  @access private
 */
const getAll = async (req, res) => {
  try {
    // get all games
    const games = await Game.find();

    if (!games) {
      return res.status(404).json({
        message: "There is no soccer games in DB.",
      });
    }

    return res.status(200).json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 *  @description Get soccer game by id
 *  @method GET
 *  @access private
 */
const getById = async (req, res) => {
  const { id } = req.params;

  // confirm request inputs
  if (!id) {
    return res.status(400).json({ message: "Game id is required!" });
  }

  // confirm valid ObjectId
  if (!isObjectId(id)) {
    return res.status(400).json({ message: "ObjectId is not valid" });
  }

  try {
    // get User by user email.
    const game = await Game.findOne({
      _id: id,
    });

    // check if soccer game exists
    if (!game) {
      return res.status(404).json({
        message: `Soccer game with id - '${id}' does not exists.`,
      });
    }

    return res.status(200).json(game);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 *  @description Create new soccer game
 *  @method PUT
 *  @access private
 */
const create = async (req, res) => {
  const { homeTeamName, awayTeamName } = req.body;

  // confirm input fields
  if (!homeTeamName || !awayTeamName) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    // get game by home and away team names.
    const game = await Game.findOne({
      homeTeamName,
      awayTeamName,
    });

    // check if game exists
    if (game) {
      return res.status(409).json({
        message: `Soccer game '${homeTeamName} - ${awayTeamName}' already exists.`,
      });
    }

    // create new game
    await new Game(req.body).save();
    return res.status(201).json({
      message: `Soccer game '${homeTeamName} - ${awayTeamName}' Created successfully.`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
};
