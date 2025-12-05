const express = require("express");
const router = express.Router();
const { 
  placeOrder, 
  getUserOrders, 
  getAllOrders ,
  getOrderById,
  updateOrderById
} = require("../controllers/orderController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", placeOrder);

router.get("/my", getUserOrders);

router.get("/", isAdmin ,getAllOrders);

router.get('/:id', isAdmin, getOrderById);

router.put('/:id', isAdmin, updateOrderById)

module.exports = router;
