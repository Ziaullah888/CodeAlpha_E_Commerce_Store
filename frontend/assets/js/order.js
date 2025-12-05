console.log("orders.js loaded");

window.addEventListener("DOMContentLoaded", loadOrders);

async function loadOrders() {
  const ordersContainer = document.querySelector(".orders-page");
  const data = await apiGet("/orders/my");

  if (!Array.isArray(data) || data.length === 0) {
    ordersContainer.innerHTML += `<p>No orders found.</p>`;
    return;
  }

  ordersContainer.innerHTML = "<h2>My Orders</h2>";

  data.forEach(order => {
    const itemsText = order.products
      .map(p => `${p.productId?.name || "Item"} × ${p.quantity}`)
      .join(", ");

    const date = new Date(order.createdAt).toLocaleDateString();

    ordersContainer.innerHTML += `
      <div class="order-card">
        <p><strong>Order ID:</strong> #${order._id}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Items:</strong> ${itemsText}</p>
        <p><strong>Total:</strong> ₨ ${order.totalAmount}</p>
        <p>
          <strong>Status:</strong>
          <span class="status ${order.status}">${order.status}</span>
        </p>
      </div>
    `;
  });
}
