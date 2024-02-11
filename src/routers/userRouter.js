const router = require("express").Router();
const userController = require("../controllers/userController");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/setAvatar/:id", userController.setAvatar);
router.get("/allUsers/:id", userController.getAllUsers);
module.exports = router;
