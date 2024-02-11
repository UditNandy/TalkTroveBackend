const User = require("../models/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;
  const usernameCheck = await User.findOne({ username: username });
  if (usernameCheck) {
    return res
      .status(400)
      .json({ status: "Failed", message: "Username already exists" });
  }
  const emailCheck = await User.findOne({ email: email });
  if (emailCheck) {
    return res
      .status(400)
      .json({ status: "Failed", message: "Email id already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.status(200).json({ staus: "Success", user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res
        .status(400)
        .json({ status: "Failed", message: "Incorrect username" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ status: "Failed", message: "Incorrect password" });
    delete user.password;
    return res.status(200).json({ staus: "Success", user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    await User.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage,
    });
    const userData = await User.findByIdAndUpdate(userId);
    return res.status(200).json({
      status: "Success",
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (err) {}
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "username",
      "email",
      "avatarImage",
    ]);
    res.status(200).json({ status: "Success", users: users });
  } catch (err) {}
};
