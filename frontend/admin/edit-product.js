console.log("edit-product.js loaded");

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.querySelector("#editProductForm");
  const messageBox = document.querySelector("#message");

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) {
    showToast("No product ID provided", "error");
    return;
  }

  try {
    const product = await apiGet(`/products/${productId}`);
    document.querySelector("#name").value = product.name;
    document.querySelector("#price").value = product.price;
    document.querySelector("#category").value = product.category;
    document.querySelector("#stock").value = product.stock;
    document.querySelector("#imageURL").value = product.imageURL;
  } catch (err) {
    console.error(err);
    showToast("Failed to load product", "error");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const updatedProduct = {
      name: document.querySelector("#name").value,
      price: document.querySelector("#price").value,
      category: document.querySelector("#category").value,
      stock: document.querySelector("#stock").value,
      imageURL: document.querySelector("#imageURL").value,
    };

    try {
      const res = await apiPut(`/products/${productId}`, updatedProduct);
      showToast("Product updated successfully", "success");
      window.location.href = "productList.html";
    } catch (err) {
      console.error(err);
      showToast("Failed to update product", "error");
    }
  });

  function showToast(msg, type = "success") {
    messageBox.textContent = msg;
    messageBox.style.background = type === "success" ? "green" : "red";
    messageBox.style.display = "block";
    setTimeout(() => (messageBox.style.display = "none"), 3000);
  }
});
