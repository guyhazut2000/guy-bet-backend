const router = require("express").Router();
const SoccerBetController = require("../controllers/soccerBetController");

router
  .get("/all", SoccerBetController.getAll)
  .post("/all", SoccerBetController.getAllByUserId)
  .post("/", SoccerBetController.getById)
  .post("/update", SoccerBetController.update)
  .put("/create", SoccerBetController.create)
  .post("/admin/create", SoccerBetController.createByAdmin);

module.exports = router;
