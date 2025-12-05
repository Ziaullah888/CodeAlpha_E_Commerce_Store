console.log("checkout loaded");

const nameBox = document.querySelector("#checkout-name");
const totalBox = document.querySelector("#checkout-total");
const nameInput = document.querySelector(
  'input[placeholder="Enter your full name"]'
);
const addressInput = document.querySelector(
  'input[placeholder="Enter your address"]'
);
const cityInput = document.querySelector(
  'input[placeholder="Enter your city"]'
);
const phoneInput = document.querySelector(
  'input[placeholder="Enter phone number"]'
);
const card = document.querySelector("#payment-info");

async function loadCheckout() {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:3000/api/cart", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!data.products || data.products.length === 0) {
    nameBox.textContent = "Your cart is empty";
    totalBox.innerHTML = `<strong>Total: 0</strong>`;
    return;
  }

  let total = 0;
  data.products.forEach((item) => {
    if(item.product == null) return; 
    const p = item.product;
    const qty = item.quantity;
    total += p.price * qty;
    const pEl = document.createElement("p");
    pEl.textContent = `${p.name} × ${qty} — RS ${p.price * qty}`;
    nameBox.appendChild(pEl);
  });

  totalBox.innerHTML = `<strong>Total: RS ${total.toLocaleString()}</strong>`;
}

loadCheckout();

document.querySelector("#placeOrder").addEventListener("click", async (e) => {
  e.preventDefault();
  const errorBox = document.querySelector("#error-box");

  errorBox.textContent = "";

  if (
    !nameInput.value ||
    !addressInput.value ||
    !cityInput.value ||
    !phoneInput.value ||
    !card.value
  ) {
    errorBox.textContent = "Please fill in all the fields";
    return;
  }

  const cartItems = await getCart();
  const products = cartItems.map((item) => {
    if (!item.product) return null;
    return {
      productId: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    };
  }).filter(item => item !== null);
  const totalAmount = products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const address = `${nameInput.value}, ${addressInput.value}, ${cityInput.value}, ${phoneInput.value}`;

  const res = await apiPost("/orders", { products, totalAmount, address });

  if (res._id) {
    showToast("Order placed successfully!", "success");
    setTimeout(() => {
      window.location.href = "orders.html";
    }, 800);
  } else {
    showToast(res.error || "Something went wrong!", "error");
    errorBox.textContent = res.error || "Something went wrong!";
  }
});
