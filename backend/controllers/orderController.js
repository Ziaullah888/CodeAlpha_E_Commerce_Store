const Order = require("../models/orderModel");

// Place an order
exports.placeOrder = async (req, res) => {
  try {
    const { products, totalAmount, address } = req.body;

    if (!products || products.length === 0)
      return res.status(400).json({ error: "No products in order" });

    const order = await Order.create({
      userId: req.user._id,
      products,
      totalAmount,
      address,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get orders of logged-in user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).populate(
      "products.productId"
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("products.productId")
      .populate("userId", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("products.productId")
      .populate("userId", "name email");

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrderById = async (req, res) => {
  try {
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("products.productId")
      .populate("userId", "name email");

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    return res.status(200).json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};
