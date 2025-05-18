require("dotenv").config({ path: ".env" });
const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const WebSocket = require("ws");

const authRoutes = require("./routes/authRoutes");
const householdRoutes = require("./routes/householdRoutes");
const userRoutes = require("./routes/userRoutes");
const adminAuthRoutes = require("./routes/adminRoutes");
const logRoutes = require("./routes/logRoutes");
const searchRoutes = require("./routes/searchRoutes");
const {
  router: deviceRoutes,
  setupDeviceWebSocket,
} = require("./routes/deviceRoutes");
const { householdDB } = require("./db/dbConnection");
require("./db/dbConnection");

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/household", householdRoutes);
app.use("/user", userRoutes);
app.use("/device", deviceRoutes);
app.use("/admin", adminAuthRoutes);
app.use("/log", logRoutes);
app.use("/search", searchRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const wss = new WebSocket.Server({
  server,
  path: "/ws",
  verifyClient: (info, done) => {
    done(true);
  },
});

setupDeviceWebSocket(wss);
