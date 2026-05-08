const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  userId: String,
  url: String,
  timeSpent: Number,
  category: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Activity", activitySchema);