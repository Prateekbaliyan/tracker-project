const { app, BrowserWindow } = require("electron");
const activeWin = require("active-win");
const axios = require("axios");

let lastApp = null;
let startTime = Date.now();

// 🔥 CATEGORY FUNCTION
function getCategory(appName) {
  appName = appName.toLowerCase();

  if (
    appName.includes("code") ||
    appName.includes("visual studio") ||
    appName.includes("copilot")||
    appName.includes("postman")

  ) return "productive";

  if (
    appName.includes("whatsapp") ||
    appName.includes("telegram") ||
    appName.includes("vlc") ||
    appName.includes("media")
  ) return "distraction";

  if (
    appName.includes("edge") ||
    appName.includes("opera") ||
    appName.includes("explorer")
  ) return "neutral";

  return "neutral";
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  win.loadFile("login.html");

  console.log("🚀 System tracker started...");

  setInterval(async () => {
    try {
      const activeWindow = await activeWin();
      const appName = activeWindow?.owner?.name || "System App";

      console.log("🟡 Active App:", appName);

      // ❌ ignore chrome
      const ignoredApps = ["Google Chrome", "chrome.exe"];
      if (ignoredApps.includes(appName)) return;

      const endTime = Date.now();
      const timeSpent = Math.floor((endTime - startTime) / 1000);

      // 🔥 DEBUG
      console.log("Last App:", lastApp);
      console.log("Time Spent:", timeSpent);

      // 🔥 FORCE SAVE (test ke liye)
      if (lastApp) {
        const category = getCategory(lastApp);

        console.log(`📤 Sending: ${lastApp} → ${timeSpent}s`);

        const token = await win.webContents.executeJavaScript('localStorage.getItem("token")'); // ⚠️ replace
        if(!token){
            console.log("No token yet");
            return;
        }

        await axios.post(
          "http://localhost:5000/api/activity/track",
          {
            url: lastApp,
            timeSpent,
            category
          },
          {
            headers: {
              Authorization: token
            }
          }
        );

        console.log("✅ Saved successfully");
      }

      // update
      lastApp = appName;
      startTime = Date.now();

    } catch (err) {
      console.log("❌ AXIOS ERROR:", err.response?.data || err.message);
    }
  }, 3000);
}

app.whenReady().then(createWindow);
