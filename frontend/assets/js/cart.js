console.log("cart.js loaded");
const BASE_URL = "http://localhost:3000/api";

window.addEventListener("DOMContentLoaded", loadCart);

async function loadCart() {
  const token = localStorage.getItem("token");
  const list = document.querySelector(".cart-items");
  const totalBox = document.querySelector("#total-price");

  const res = await fetch(`${BASE_URL}/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
   let sum = 0;  // 1 

  list.innerHTML = "";

  (data.products || []).forEach((item) => {
    if (!item.product) return;
    const p = item.product;
     sum += item.product.price * item.quantity; // 2

    list.innerHTML += `
      <div class="cart-row">
        <div>
        <img src="${p.imageURL}" class="cart-img">
        <div class="cart-info">
          <h4>${p.name}</h4>
          <p>₨ ${p.price}</p>
        </div>
        </div>
      <div class='cls-btn'>
        <div class="qty-controls">
          <button class="decrease" data-id="${p._id}">-</button>
          <span>${item.quantity}</span>
          <button class="increase" data-id="${p._id}">+</button>
        </div>

        <button class="remove" data-id="${p._id}">Remove</button>
      </div>
      </div>
    `;
  });
 
  totalBox.textContent = sum.toLocaleString(); // 3
}

document.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;

  if (!id) return;

  if (e.target.classList.contains("increase")) {
    await apiPut("/cart/update", { productId: id, action: "increase" });
    loadCart();
  }

  if (e.target.classList.contains("decrease")) {
    await apiPut("/cart/update", { productId: id, action: "decrease" });
    loadCart();
  }

  if (e.target.classList.contains("remove")) {
    await apiDelete(`/cart/remove/${id}`);
    showToast("Product removed from cart", "success");
    loadCart();
  }
});

