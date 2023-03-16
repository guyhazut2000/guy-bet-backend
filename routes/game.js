const router = require("express").Router();
const GameController = require("../controllers/gameController");

router
  .get("/all", GameController.getAll)
  .get("/:id", GameController.getById)
  .put("/create", GameController.create);

module.exports = router;
