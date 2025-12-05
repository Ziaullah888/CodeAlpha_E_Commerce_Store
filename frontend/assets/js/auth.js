console.log("auth loaded");

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.querySelector("#loginBtn");
  let error = document.querySelector("#error-message");

  if (!loginBtn) return;

  loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();

    if (!email || !password) {
      showToast("Please enter email and password", "error");
      error.innerHTML = '"Please enter email and password"'
      return;
    }

    try {
      const res = await apiPost("/auth/login", { email, password });

      if (res.token && res.user) {
        localStorage.setItem("token", res.token);

        if (res.user.role === "admin") {
          localStorage.setItem("isAdmin", "true");
          error.innerHTML = 'Login Success!'
          showToast("Admin login successful!", "success");
          setTimeout(() => {
            window.location.href = "admin/dashboard.html";
          }, 800);
        } else {
          localStorage.removeItem("isAdmin");
          error.innerHTML = 'Login Success!'
          showToast("Login successful!", "success");
          setTimeout(() => {
            window.location.href = "index.html";
          }, 800);
        }
      } else {
        showToast(res.error || "Login failed", "error");
        if (error) error.textContent = res.error || "Login failed";
      }
    } catch (err) {
      console.error(err);
      showToast("Server error. Please try again.", "error");
    }
  });
});

const registerForm = document.querySelector("#registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const confirmPassword = document.querySelector("#confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const res = await apiPost("/auth/register", { name, email, password });

    if (res.user) {
      showToast("Registration successful! Please login.", "success");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 800);
    } else {
      showToast(res.error || "Registration failed", "error");
    }
  });
}
