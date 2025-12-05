console.log("Admin Dashboard Loaded");

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const products = await apiGet("/products");
    const orders = await apiGet("/orders");
    const users = await apiGet("/auth/all"); 

    document.querySelector("#totalProducts").textContent = products.length;

    document.querySelector("#totalOrders").textContent = orders.length;

    document.querySelector("#totalUsers").textContent = users.users.length || '0';

    let totalSales = 0;
    orders.forEach((order) => {
      totalSales += order.totalAmount || 0;
    });

    document.querySelector("#totalSales").textContent = totalSales.toLocaleString();

  } catch (err) {
    console.error("Dashboard Error:", err);
  }
});
