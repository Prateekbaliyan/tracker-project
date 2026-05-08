const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Middleware to get user from token
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

// @route   POST /api/friends/request
// @desc    Send a friend request by email
router.post("/request", auth, async (req, res) => {
  try {
    const { email } = req.body;
    const targetUser = await User.findOne({ email });

    if (!targetUser) return res.status(404).json({ msg: "User not found" });
    if (targetUser._id.toString() === req.user.id) return res.status(400).json({ msg: "Cannot add yourself" });

    // Check if already friends
    const currentUser = await User.findById(req.user.id);
    if (currentUser.friends.includes(targetUser._id)) {
      return res.status(400).json({ msg: "Already friends" });
    }

    // Check if request already sent
    if (targetUser.friendRequests.includes(req.user.id)) {
      return res.status(400).json({ msg: "Friend request already sent" });
    }

    targetUser.friendRequests.push(req.user.id);
    await targetUser.save();

    res.json({ msg: "Friend request sent successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/friends/accept
// @desc    Accept a friend request
router.post("/accept", auth, async (req, res) => {
  try {
    const { friendId } = req.body;
    const currentUser = await User.findById(req.user.id);
    const friendUser = await User.findById(friendId);

    if (!currentUser.friendRequests.includes(friendId)) {
      return res.status(400).json({ msg: "No friend request found from this user" });
    }

    // Remove from requests, add to friends
    currentUser.friendRequests = currentUser.friendRequests.filter(id => id.toString() !== friendId);
    currentUser.friends.push(friendId);
    
    // Add to friend's friend list too (mutual)
    if (!friendUser.friends.includes(req.user.id)) {
        friendUser.friends.push(req.user.id);
    }

    await currentUser.save();
    await friendUser.save();

    res.json({ msg: "Friend request accepted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/friends
// @desc    Get user's friends and pending requests
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("friends", "email _id")
      .populate("friendRequests", "email _id");

    res.json({
      friends: user.friends,
      friendRequests: user.friendRequests
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
