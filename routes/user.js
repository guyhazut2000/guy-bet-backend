const router = require("express").Router();
const UserController = require("../controllers/userController");

router
  .get("/all", UserController.getAll)
  .get("/:email", UserController.getByEmail)
  .post("/login", UserController.login)
  .put("/create", UserController.create);

module.exports = router;
