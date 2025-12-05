console.log("admin orders.js loaded");

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("#ordersContainer");

  try {
    const orders = await apiGet("/orders");

    if (!orders.length) {
      container.innerHTML = "<p>No orders yet.</p>";
      return;
    }

    container.innerHTML = orders
      .map((order) => {
        const items = order.products
          .map((p) => `${p.productId.name} × ${p.quantity}`)
          .join(", ");
        return `
          <div class="order-card">
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>User:</strong> ${order.userId?.name} (${
          order.userId?.email
        })</p>
            <p><strong>Items:</strong> ${items}</p>
            <p><strong>Total:</strong> ₨ ${order.totalAmount}</p>
            <p>
              <strong>Status:</strong> 
              <select class="status-select" data-id="${order._id}">
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
            </p>
            <button class="btn-small view-details" data-id="${
              order._id
            }">View Details</button>
          </div>
        `;
      })
      .join("");
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Failed to load orders.</p>";
  }

  container.addEventListener("change", async (e) => {
    if (e.target.classList.contains("status-select")) {
      const orderId = e.target.dataset.id;
      const newStatus = e.target.value;
      try {
        await apiPut(`/orders/${orderId}`, { status: newStatus });
        alert("Status updated!");
      } catch (err) {
        console.error(err);
        alert("Failed to update status");
      }
    }
  });

  container.addEventListener("click", (e) => {
    if (e.target.classList.contains("view-details")) {
      const orderId = e.target.dataset.id;
      window.location.href = `orderDetails.html?id=${orderId}`;
    }
  });
});
