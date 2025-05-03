const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getMe,
  toggleFavoriteCountry,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", protect, logoutUser);
router.get("/refresh", refreshAccessToken);
router.get("/me", protect, getMe);
router.put("/favorites", protect, toggleFavoriteCountry);

module.exports = router;
