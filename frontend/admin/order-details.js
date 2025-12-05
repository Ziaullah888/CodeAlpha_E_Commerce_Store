console.log("orderDetails.js loaded");

document.addEventListener("DOMContentLoaded", loadOrderDetails);

async function loadOrderDetails() {
  const container = document.getElementById("orderDetails");

  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("id");

  if (!orderId) {
    container.innerHTML = "<p>Invalid order ID</p>";
    return;
  }

  try {
    const order = await apiGet(`/orders/${orderId}`);

    if (!order) {
      container.innerHTML = "<p>Order not found.</p>";
      return;
    }

    const itemsHTML = order.products
      .map(
        (p) => `
        <li>
          ${p.productId.name} × ${p.quantity} — 
          <strong>₨ ${p.productId.price * p.quantity}</strong>
        </li>
      `
      )
      .join("");

    container.innerHTML = `
      <div class="details-card">
        <h3>Order #${order._id}</h3>

        <p><strong>User:</strong> ${order.userId?.name} (${
      order.userId?.email
    })</p>
        <p><strong>Date:</strong> ${new Date(
          order.createdAt
        ).toLocaleString()}</p>

         <p><strong>Shipping Address:</strong> ${order.address}</p>

        <h4>Items</h4>
        <ul>${itemsHTML}</ul>

        <p><strong>Total Amount:</strong> ₨ ${order.totalAmount}</p>

        <label><strong>Status:</strong></label>
        <select id="statusSelect">
          <option value="pending" ${
            order.status === "pending" ? "selected" : ""
          }>Pending</option>
          <option value="shipped" ${
            order.status === "shipped" ? "selected" : ""
          }>Shipped</option>
          <option value="delivered" ${
            order.status === "delivered" ? "selected" : ""
          }>Delivered</option>
        </select>

        <button id="updateStatusBtn" class="btn-update">Update Status</button>
      </div>
    `;

    document
      .getElementById("updateStatusBtn")
      .addEventListener("click", async () => {
        const newStatus = document.getElementById("statusSelect").value;

        try {
          await apiPut(`/orders/${orderId}`, { status: newStatus });
          alert("Status updated!");
        } catch (err) {
          console.error(err);
          alert("Failed to update status");
        }
      });
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Error loading order details</p>";
  }
}
