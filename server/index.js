const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// 👇 MongoDB connect
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected 🚀"))
.catch(err => console.log(err));

// 👇 ROUTES YAHAN ADD KARNE HAIN
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);


const activityRoutes = require("./routes/activity");
app.use("/api/activity", activityRoutes);

const friendsRoutes = require("./routes/friends");
app.use("/api/friends", friendsRoutes);

const leaderboardRoutes = require("./routes/leaderboard");
app.use("/api/leaderboard", leaderboardRoutes);

// 👇 test route
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});