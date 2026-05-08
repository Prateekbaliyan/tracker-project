const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });
  try {
    const decoded = jwt.verify(token, "secretkey");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

router.get("/", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id).populate("friends", "email");
    if (!currentUser) return res.status(404).json({ msg: "User not found" });

    // Include user's own ID and friends' IDs
    const userIds = [currentUser._id, ...currentUser.friends.map(f => f._id)];

    // Today's boundaries
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const activities = await Activity.find({
      userId: { $in: userIds },
      createdAt: { $gte: start, $lte: end }
    });

    const userStats = {};

    activities.forEach(item => {
      if (!userStats[item.userId]) {
        userStats[item.userId] = { totalTime: 0, productiveTime: 0 };
      }
      userStats[item.userId].totalTime += item.timeSpent;
      if (item.category === "productive") {
        userStats[item.userId].productiveTime += item.timeSpent;
      }
    });

    // Format data and calculate percentage
    const leaderboardData = [];

    // Also include friends who have 0 tracked time today
    userIds.forEach(id => {
      const stats = userStats[id] || { totalTime: 0, productiveTime: 0 };
      let percentage = 0;
      if (stats.totalTime > 0) {
        percentage = ((stats.productiveTime / stats.totalTime) * 100).toFixed(0);
      }

      let email = "You";
      if (id.toString() !== currentUser._id.toString()) {
        const friend = currentUser.friends.find(f => f._id.toString() === id.toString());
        email = friend ? friend.email : "Unknown";
      }

      leaderboardData.push({
        id: id.toString(),
        name: email,
        percentage: Number(percentage),
        isYou: id.toString() === currentUser._id.toString()
      });
    });

    // Sort by percentage descending
    leaderboardData.sort((a, b) => b.percentage - a.percentage);

    res.json(leaderboardData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
