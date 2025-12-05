const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
    },

    imageURL: {
      type: String,
      required: [true, "Product image URL is required"],
    },

    category: {
      type: String,
    },

    stock: {
      type: Number,
      required: [true, "Product stock quantity is required"],
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
