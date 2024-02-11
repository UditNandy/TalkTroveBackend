const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routers/userRouter");
const messageRoute = require("./routers/messageRouter");
const socket = require("socket.io");

const app = express();

require("dotenv").config();
app.use(cors());
app.use(express.json());

//Move to app js

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRoute);

//end here

const server = app.listen(process.env.PORT, () => {
  console.log("Server started on", process.env.PORT);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});


global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recive", data.message);
    }
  });
});

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected successfully with DB");
  })
  .catch((err) => {
    console.log(err);
  });
