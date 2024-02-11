const router = require("express").Router();
const messageController = require("../controllers/messageController");

router.post("/addMsg/", messageController.addMessage);
router.post("/getMsg/", messageController.getAllMessages);

module.exports = router;
