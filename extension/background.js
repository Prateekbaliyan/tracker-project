let currentTab = "";
let startTime = Date.now();

// 🔥 CATEGORY MAP
const categories = {
  productive: [
    "github.com",
    "leetcode.com",
    "geeksforgeeks.org",
    "stackoverflow.com",
    "chat.openai.com",
    "chatgpt.com",
    "coursera.org",
    "udemy.com",
    "edx.org",
    "kaggle.com",
    "docs.google.com",
    "drive.google.com",
    "notion.so",
    "medium.com",
    "dev.to"
  ],

  study: [
    "nptel.ac.in",
    "w3schools.com",
    "tutorialspoint.com",
    "javatpoint.com",
    "byjus.com",
    "unacademy.com",
    "vedantu.com"
  ],

  distraction: [
    "youtube.com",
    "instagram.com",
    "facebook.com",
    "twitter.com",
    "x.com",
    "snapchat.com",
    "netflix.com",
    "primevideo.com",
    "hotstar.com",
    "zee5.com",
    "spotify.com"
  ],

  social: [
    "linkedin.com",
    "web.whatsapp.com",
    "whatsapp.com",
    "telegram.org",
    "discord.com",
    "reddit.com"
  ],

  shopping: [
    "amazon.in",
    "flipkart.com",
    "myntra.com",
    "ajio.com",
    "meesho.com"
  ]
};

// 🔥 CATEGORY DETECTION
function getCategory(url) {
  if (!url) return "unknown";

  try {
    let domain = new URL(url).hostname;

    for (let type in categories) {
      if (categories[type].some(site => domain.includes(site))) {
        return type;
      }
    }

    return "neutral";
  } catch {
    return "unknown";
  }
}

// 🔥 TAB SWITCH LISTENER
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  let tab = await chrome.tabs.get(activeInfo.tabId);

  let now = Date.now();

  if (currentTab !== "") {
    let timeSpent = (now - startTime) / 1000;

    // 🔥 SHORT TIME FIX
    if (timeSpent < 5) {
      currentTab = tab.url;
      startTime = now;
      return;
    }

    let category = getCategory(currentTab);

    console.log(
      `⏱ ${currentTab} → ${timeSpent.toFixed(2)}s | ${category}`
    );

    // 🔥 DOMAIN EXTRACT
    let domain;
    try {
      domain = new URL(currentTab).hostname;
    } catch {
      domain = "unknown";
    }

    // 🔥 TOKEN + API CALL
    chrome.storage.local.get(["token"], async (result) => {
      const token = result.token;

      if (!token) {
        console.log("❌ No token found (login required)");
        return;
      }

      console.log("✅ Token found");

      try {
        await fetch("http://localhost:5000/api/activity/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          },
          body: JSON.stringify({
            url: domain,
            timeSpent: timeSpent,
            category: category
          })
        });

        console.log("✅ Data sent successfully");
      } catch (err) {
        console.log("❌ Error sending data:", err);
      }
    });
  }

  currentTab = tab.url;
  startTime = now;

  console.log("🔄 Switched to:", currentTab);
});
