const Message = require("../models/messageModel");

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Message.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    if (data)
      return res.json({
        status: "success",
        message: "Message added sucessfully",
      });
    return res.json({
      status: "failed",
      message: "Failed to add message to database",
    });
  } catch (err) {
    next(err);
  }
};
module.exports.getAllMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await Message.find({ users: { $all: [from, to] } }).sort({
      updatedAt: 1,
    });
    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json({ status: "Success", data: projectedMessages });
  } catch (err) {
    next(err);
  }
};
