const { verifyToken } = require("../config/jwt");
const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/User");

// Protect routes
const protect = async (req, res, next) => {
  let token;

  // Get token from cookie
  if (req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    // Verify token
    const decoded = verifyToken(token);

    // Check if user still exists
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorResponse("No user found with this id", 404));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
};

module.exports = { protect };
