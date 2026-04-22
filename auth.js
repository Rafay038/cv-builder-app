const API_BASE_URL = "https://cv-builder-app-x606.onrender.com/api/auth";

const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");

if (signupForm) {
  signupForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();
    const message = document.getElementById("signupMessage");

    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        message.textContent = data.message || "Signup failed";
        return;
      }

      message.textContent = "Signup successful. Redirecting to login...";

      setTimeout(function () {
        window.location.href = "login.html";
      }, 1200);
    } catch (error) {
      message.textContent = "Could not connect to backend";
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const message = document.getElementById("loginMessage");

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        message.textContent = data.message || "Login failed";
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      message.textContent = "Login successful. Redirecting...";

      setTimeout(function () {
        window.location.href = "index.html";
      }, 1000);
    } catch (error) {
      message.textContent = "Could not connect to backend";
    }
  });
}