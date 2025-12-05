const Cart = require("../models/cartModel");

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "products.product"
    );
    if (!cart) return res.json({ message: "Cart is empty", products: [] });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, products: [] });

    const { productId, quantity } = req.body;

    const existingProduct = cart.products.find(
      (p) => p.product.toString() === productId
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity, action } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.products.find((p) => p.product.toString() === productId);
    if (!item) return res.status(404).json({ error: "Product not in cart" });

    if (action === "increase") item.quantity += 1;
    else if (action === "decrease" && item.quantity > 1) item.quantity -= 1;
    else if (quantity !== undefined) item.quantity = quantity;

    await cart.save();
    res.json(cart); // send updated cart
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Remove item from cart
exports.removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== productId
    );

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
