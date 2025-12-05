const express = require("express");
const router = express.Router();
const { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require("../controllers/productController");
const { isAdmin, protect } = require("../middleware/authMiddleware");

// Get all products
router.get("/", getAllProducts);

// Get single product
router.get("/:id", getProductById);

// Create product (admin)
router.post("/", protect ,isAdmin ,createProduct);

// Update product
router.put("/:id", protect ,isAdmin ,updateProduct);

// Delete product
router.delete("/:id", protect ,isAdmin ,deleteProduct);

module.exports = router;
