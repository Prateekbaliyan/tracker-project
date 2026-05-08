const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");
const jwt = require("jsonwebtoken");

router.post("/track", async (req, res) => {
  const token = req.headers.authorization;

  let userId = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, "secretkey");
      userId = decoded.id;
    } catch (err) {
      console.log("Invalid token");
    }
  }

  const { url, timeSpent, category } = req.body;

  const newActivity = new Activity({
    userId,
    url,
    timeSpent,
    category
  });

  await newActivity.save();

  console.log("Saved for user:", userId);

  res.json({ message: "Saved successfully" });
});

router.get("/stats", async (req, res) => {

  // 🔥 TOKEN → USER FILTER
  const token = req.headers.authorization;

  let userId = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, "secretkey");
      userId = decoded.id;
    } catch (err) {
      console.log("Invalid token");
    }
  }

  // 🔥 TODAY FILTER
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  // 🔥 USER + TODAY DATA
  const activities = await Activity.find({
    userId,
    createdAt: { $gte: start, $lte: end }
  });
  

  let totalTime = 0;
  let categoryData = {};
  let siteData = {};

  activities.forEach((item) => {
    totalTime += item.timeSpent;

    // category
    if (!categoryData[item.category]) {
      categoryData[item.category] = 0;
    }
    categoryData[item.category] += item.timeSpent;

    // site
    if (!siteData[item.url]) {
      siteData[item.url] = 0;
    }
    siteData[item.url] += item.timeSpent;
  });

  // 🔥 Top site
  let topSite = null;
  let maxTime = 0;

  for (let site in siteData) {
    if (siteData[site] > maxTime) {
      maxTime = siteData[site];
      topSite = site;
    }
  }

  try {
    topSite = new URL(topSite).hostname.replace("www.", "");
  } catch {
    topSite = topSite || "system-app";
  }

  // 🔥 convert minutes
  let totalMinutes = (totalTime / 60).toFixed(2);

  let categoryMinutes = {};
  for (let key in categoryData) {
    categoryMinutes[key] = (categoryData[key] / 60).toFixed(2);
  }

  // 🔥 DAILY SUMMARY
  let productive = parseFloat(categoryMinutes.productive) || 0;
  let distraction = parseFloat(categoryMinutes.distraction) || 0;

  
  let score = 0;

let buckets = {
  morning: 0,
  afternoon: 0,
  night: 0
};

activities.forEach((item) => {
  let hour = new Date(item.createdAt).getHours();

  if (hour >= 6 && hour < 12) {
    if (item.category === "productive") {
      buckets.morning += item.timeSpent;
    }
  } else if (hour >= 12 && hour < 18) {
    if (item.category === "productive") {
      buckets.afternoon += item.timeSpent;
    }
  } else {
    if (item.category === "productive") {
      buckets.night += item.timeSpent;
    }
  }
});
if (totalMinutes > 0) {
  score = ((productive / totalMinutes) * 100).toFixed(0);
}

// 🔥 STREAK LOGIC
let streak = 0;

if (productive > distraction) {
  streak = 1; // simple version (daily basis)
} else {
  streak = 0;
}

  

let insights = [];

// 🔥 productivity insight
if (productive > distraction && productive > 60) {
  insights.push("🔥 Excellent focus!");
}

// 🔥 distraction alert
if (distraction > productive && distraction > 30) {
  insights.push("🚨 High distraction detected!");
}

// 🔥 balance insight
if (productive > 0 && distraction > 0) {
  insights.push("⚖️ Balanced usage, improve focus.");
}

// 🔥 time-based insight
let hour = new Date().getHours();
if (hour >= 23) {
  insights.push("🌙 Late night usage detected.");
}

// 🔥 fallback
if (insights.length === 0) {
  insights.push("📊 Start tracking to get insights.");
}
let peakTime = "No data";
let max = 0;

for (let key in buckets) {
  if (buckets[key] > max) {
    max = buckets[key];
    peakTime = key;
  }
}
let trend = "";

if (productive > distraction) {
  trend = "📈 Productivity is improving";
} else if (distraction > productive) {
  trend = "📉 Distraction is increasing";
} else {
  trend = "⚖️ Stable usage pattern";
}

// combine
let summary = insights.join(" ");
// 🔥 FINAL SMART INSIGHT
let smartInsight = "";
// 🔥 DAILY GOAL (hardcoded for now)
let dailyGoal = 120; // minutes

// 🔥 PRODUCTIVE TIME (already hai)
// let productive = categoryMinutes.productive || 0;

// 🔥 PROGRESS %
let goalProgress = ((productive / dailyGoal) * 100).toFixed(0);

// 🔥 STATUS
let goalStatus = "";

if (productive >= dailyGoal) {
  goalStatus = "🎯 Goal Achieved!";
} else {
  goalStatus = "⏳ Keep going!";
}

smartInsight = `Your best focus time is ${peakTime}. ${trend}.`;

if (distraction > productive) {
  smartInsight += " Try reducing distractions during this period.";
} else {
  smartInsight += " Keep maintaining this productivity level.";
}

let alertMessage = "";
let alertType = "info";

// 🔴 HIGH DISTRACTION
if (categoryMinutes.distraction > categoryMinutes.productive) {
  alertMessage = "⚠️ You are spending more time on distractions!";
  alertType = "danger";
}

// 🟡 LOW PRODUCTIVITY
else if (categoryMinutes.productive < 30) {
  alertMessage = "😴 Very low productive time today, focus more!";
  alertType = "warning";
}

// 🟠 NEAR GOAL
else if (goalProgress >= 80 && goalProgress < 100) {
  alertMessage = "🔥 You're very close to your goal!";
  alertType = "info";
}

// 🟢 GOAL ACHIEVED
else if (goalProgress >= 100) {
  alertMessage = "🎯 Amazing! You achieved your goal!";
  alertType = "success";
}

// 🔵 DEFAULT
else {
  alertMessage = "⚖️ Balanced usage, keep improving!";
  alertType = "info";
}
if (!userId) {
  return res.json({
    totalMinutes: 0,
    categoryMinutes: {},
    topSite: "No data",
    summary: "Login required",
    score: 0,
    streak: 0,
    peakTime: "No data",
    trend: "",
    smartInsight: "",
    goal: 120,
    goalProgress: 0,
    goalStatus: "",
    alertMessage: "Please login",
    alertType: "warning"
  });
}

res.json({
  totalMinutes,
  categoryMinutes,
  topSite,
  summary,
  score,
  streak,
  peakTime,
  trend,
  smartInsight,
  goal: dailyGoal,
  goalProgress,
  goalStatus,
  alertMessage,
  alertType
});
});

router.get("/timeline", async (req, res) => {
  const token = req.headers.authorization;
  let userId = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, "secretkey");
      userId = decoded.id;
    } catch (err) {
      console.log("Invalid token in timeline");
    }
  }

  const activities = await Activity.find({ userId }).sort({ createdAt: -1 });

  res.json(activities);
});
module.exports = router;