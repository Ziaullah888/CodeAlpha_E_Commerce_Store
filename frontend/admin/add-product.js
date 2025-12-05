console.log("Admin add-product.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#addProductForm");
  const messageBox = document.querySelector("#message");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.querySelector("#name").value.trim();
    const price = document.querySelector("#price").value.trim();
    const description = document.querySelector("#description").value.trim();
    const imageURL = document.querySelector("#image").value.trim();
    const category = document.querySelector("#category").value.trim();
    const stock = document.querySelector("#stock").value.trim();
    const message = document.querySelector("#error-message");

    if (!name || !price || !description || !imageURL || !category || !stock) {
      showToast("Please fill all fields", "error");
      messageBox.textContent = "Please fill all fields";
      return;
    }

    const body = { name, price, description, imageURL, category, stock };

    try {
      const res = await apiPost("/products", body);

      if (res._id) {
        showToast("Product added successfully!", "success");
        message.textContent = "Product added successfully!";
        form.reset();
      } else {
        showToast(res.error || "Failed to add product", "error");
        message.textContent = `Failed to add product`;
      }
    } catch (err) {
      console.error(err);
      (message.textContent = "Something went wrong"), "error";
      showToast("Something went wrong", "error");
    }
  });

  function showToast(msg, type = "success") {
    messageBox.textContent = msg;
    messageBox.style.background = type === "success" ? "green" : "red";
    messageBox.style.display = "block";
    setTimeout(() => {
      messageBox.style.display = "none";
    }, 3000);
  }
});
