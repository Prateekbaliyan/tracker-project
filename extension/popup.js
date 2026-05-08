document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
      chrome.storage.local.set({ token: data.token });

      document.getElementById("status").innerText = "✅ Logged in!";
    } else {
      document.getElementById("status").innerText = "❌ Login failed";
    }
  } catch (err) {
    console.log(err);
  }
});
