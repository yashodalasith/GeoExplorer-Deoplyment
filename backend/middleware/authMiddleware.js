const { verifyToken } = require("../config/jwt");
const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/User");

// Protect routes
const protect = async (req, res, next) => {
  let token;

  if (req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findOne({
      _id: decoded.id,
      refreshToken: { $ne: null }, // Ensure user hasn't logged out
    });

    if (!user) {
      return next(new ErrorResponse("No user found with this id", 404));
    }

    // Additional check for token issuance after logout
    if (decoded.iat < Math.floor(user.lastLogout?.getTime() / 1000 || 0)) {
      return next(new ErrorResponse("Token invalidated by logout", 401));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
};

module.exports = { protect };
