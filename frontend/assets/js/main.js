console.log("main loaded");

const mobileMenu = document.getElementById("mobile-menu");
const navLinks = document.querySelector(".nav-links");

mobileMenu.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
  navLinks.classList.toggle("active");
});

let currentPage = window.location.pathname.split("/").pop();
if (!currentPage) {
  currentPage = "index.html";
}

document.querySelectorAll(".nav-links a").forEach((link) => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
  }
});

function showToast(message, type = "default") {
  const container = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.classList.add("toast");

  if (type === "success") toast.style.background = "green";
  if (type === "error") toast.style.background = "red";
  if (type === "warning") toast.style.background = "orange";

  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}


function formatPrice(price) {
  return "₨ " + Number(price).toLocaleString();
}

const productsHome = document.querySelector(".products-container");

if (productsHome) {
  loadAllProducts();
}
async function loadAllProducts() {
  const res = await fetch(`${API_URL}/products`);
  const products = await res.json();
  const limitedProducts = products.slice(0, 3);
  console.log(limitedProducts);

  productsHome.innerHTML = limitedProducts
    .map(
      (p) => `
      <div class="product-card">
        <img src="${p.imageURL || ""}" alt="${p.title || p.name}">
        <h3>${p.title || p.name}</h3>
        <p class="price">${formatPrice(p.price)}</p>
        <a href="product.html?id=${p._id}" class="btn view-btn">View Details</a>
      </div>
    `
    )
    .join("");
}