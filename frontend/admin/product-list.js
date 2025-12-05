console.log("Admin products.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const productList = document.querySelector("#product-list");
  const messageBox = document.querySelector("#message");

  async function loadProducts() {
    try {
      const res = await apiGet("/products"); 
      productList.innerHTML = "";

      res.forEach((p) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${p.name}</td>
          <td>₨ ${p.price}</td>
          <td>${p.category}</td>
          <td>${p.stock}</td>
          <td>
            <button class="btn-small edit" data-id="${p._id}">Edit</button>
            <button class="btn-small delete" data-id="${p._id}">Delete</button>
          </td>
        `;

        productList.appendChild(tr);
      });
    } catch (err) {
      console.error(err);
      showToast("Failed to load products", "error");
    }
  }

  loadProducts();

  productList.addEventListener("click", async (e) => {
    const id = e.target.dataset.id;
    if (!id) return;

    if (e.target.classList.contains("edit")) {
      window.location.href = `editProduct.html?id=${id}`;
    }

    if (e.target.classList.contains("delete")) {
      if (!confirm("Are you sure you want to delete this product?")) return;
      try {
        const res = await apiDelete(`/products/${id}`);
        if (res._id || res.success) {
          showToast("Product deleted successfully", "success");
          loadProducts();
        } else {
          showToast(res.error || "Failed to delete", "error");
        }
      } catch (err) {
        console.error(err);
        showToast("Error deleting product", "error");
      }
    }
  });

  // Toast function
  function showToast(msg, type = "success") {
    messageBox.textContent = msg;
    messageBox.style.background = type === "success" ? "green" : "red";
    messageBox.style.display = "block";
    setTimeout(() => {
      messageBox.style.display = "none";
    }, 3000);
  }
});
