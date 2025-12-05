console.log("product.js loaded");

function formatPrice(price) {
  return "₨ " + Number(price).toLocaleString();
}

const productsContainer = document.querySelector(".products-page");

if (productsContainer) {
  loadAllProducts();
}
async function loadAllProducts() {
  const res = await fetch(`${API_URL}/products`);
  const products = await res.json();
  console.log(products);

  productsContainer.innerHTML = products
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

const productDetail = document.querySelector(".product-detail");

if (productDetail) {
  loadSingleProduct();
}
async function loadSingleProduct() {
  const productDetail = document.querySelector(".product-detail");
  if (!productDetail) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    productDetail.innerHTML = "<p>Product ID not provided.</p>";
    return;
  }

  const res = await fetch(`${API_URL}/products/${id}`);
  const p = await res.json();

  if (!p || p.error) {
    productDetail.innerHTML = "<p>Product not found.</p>";
    return;
  }

  productDetail.innerHTML = `
    <div class="detail-left">
      <img src="${p.imageURL || ""}" alt="${p.title || p.name}">
    </div>

    <div class="detail-right">
      <h2>${p.title || p.name}</h2>
      <p class="price">${formatPrice(p.price || 0)}</p>
      <p class="desc">${p.description || "No description available."}</p>

      <button 
        class="btn addToCartBtn"
        data-id="${p._id || p.id}"
        data-name="${p.title || p.name}"
        data-price="${p.price || 0}"
        data-image="${p.imageURL || ""}"
      >
        Add to Cart
      </button>
    </div>
  `;
}

document.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("addToCartBtn")) return;

  const id = e.target.dataset.id;

  const token = localStorage.getItem("token");
  if (!token) {
    showToast("Please login first!", "warning");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId: id, quantity: 1 }),
    });

    let data = {};
    if (res.status !== 204) data = await res.json();

    if (res.ok) {
      showToast("Product added to cart", "success");
      console.log("Add to cart response:", data);
    } else {
      showToast(data.error || "Failed", "error");
    }
  } catch (err) {
    console.error(err);
  }
});
