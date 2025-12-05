const express = require("express");
const {
  loginUser,
  registerUser,
  allUser,
} = require("../controllers/authController");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/authMiddleware");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// all users
router.get("/all", protect, isAdmin, allUser);

module.exports = router;
