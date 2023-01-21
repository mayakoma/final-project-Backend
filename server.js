const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const HttpError = require("./model/HttpError");
const userRoute = require("./routes/users-route");
const productRoute = require("./routes/products-route");
const orderRoute = require("./routes/orders-route");
const adminRoute = require("./routes/admin-route");
const app = express();

/////socket-io

const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
// const port = process.env.PORT || 3001;
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let users = 0;

///////

mongoose.set("strictQuery", false);

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/user", userRoute);
app.use("/product", productRoute);
app.use("/order", orderRoute);
// app.use("/admin", adminRoute);

app.use((req, res, next) => {
  const error = new HttpError("Could  not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(
    "mongodb+srv://noyflaysher:Noy12345678@cluster0.aib29ax.mongodb.net/Bakery?retryWrites=true&w=majority"
  )
  .then(() => {
    server.listen(3001, () => console.log("listen to port 3001"));
    io.on("connection", (socket) => {
      users++;
      console.log(`num of users: ${users}`);
      socket.emit("userNumber", users);

      socket.on("disconnect", () => {
        users--;
        console.log(`num of users: ${users}`);
        socket.emit("userNumber", users);
      });
    });
  })
  .catch((err) => console.log(err));
