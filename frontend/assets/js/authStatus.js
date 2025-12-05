document.addEventListener("DOMContentLoaded", () => {
  console.log("authStatus loaded");

  const navbarLogin = document.querySelector("#nav-login");
  const navbarLogout = document.querySelector("#nav-logout");

  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin");

  if (navbarLogin) {
    navbarLogin.style.display = token ? "none" : "block";
  }

  if (navbarLogout) {
    navbarLogout.style.display = token ? "block" : "none";

    navbarLogout.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");

      if (isAdmin) {
        window.location.href = "/frontend/login.html";
      } else {
        window.location.href = "/frontend/login.html";
      }
    });
  }
});
