const User = require("../models/User");
const { generateToken, verifyToken } = require("../config/jwt");
const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/ErrorResponse");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res, next) => {
  const {
    username,
    email,
    password,
    firstName,
    lastName,
    countryOfResidence,
    nationality,
    dateOfBirth,
    gender = "prefer-not-to-say",
  } = req.body;

  // 1. Validate required fields
  const errors = [];

  if (!username) errors.push("Username is required");
  if (!email) errors.push("Email is required");
  if (!password) errors.push("Password is required");
  if (!firstName) errors.push("First name is required");
  if (!lastName) errors.push("Last name is required");
  if (!countryOfResidence) errors.push("Country of residence is required");
  if (!nationality) errors.push("Nationality is required");

  // 2. Validate field formats
  if (username && (username.length < 3 || username.length > 20)) {
    errors.push("Username must be 3-20 characters");
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Invalid email format");
  }

  if (password && password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  if (dateOfBirth && isNaN(new Date(dateOfBirth).getTime())) {
    errors.push("Invalid date format");
  } else if (dateOfBirth) {
    const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
    if (age < 13) errors.push("Must be at least 13 years old");
  }

  if (
    gender &&
    !["male", "female", "other", "prefer-not-to-say"].includes(gender)
  ) {
    errors.push("Invalid gender selection");
  }

  // 3. Check for existing user
  if (!errors.length) {
    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) errors.push("Username or email already exists");
  }

  // 4. Return errors if any
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors: errors,
    });
  }

  // 5. Create user if no errors
  const user = await User.create({
    username,
    email,
    password,
    firstName,
    lastName,
    countryOfResidence,
    nationality,
    dateOfBirth: dateOfBirth || null,
    gender,
    favoriteCountries: [],
  });

  try {
    // Generate tokens
    const tokens = generateToken(user._id);

    // Save refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    // Set cookies
    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 1000,
      path: "/",
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(201).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        countryOfResidence: user.countryOfResidence,
        nationality: user.nationality,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);

    // Specific error for JWT failures
    if (error.message.includes("JWT secret")) {
      return res.status(500).json({
        success: false,
        error: "Server configuration error",
      });
    }
    return next(error);
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // ALWAYS include password when finding user for login
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Direct comparison (model method remains unchanged)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateToken(user._id);

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 1000,
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        favoriteCountries: user.favoriteCountries,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return next(new ErrorResponse("Login failed", 500));
  }
});

// @desc    Logout user / clear cookies
// @route   GET /api/auth/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res, next) => {
  // Clear refresh token in database
  await User.findByIdAndUpdate(req.user.id, { refreshToken: null });

  // Clear cookies
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get new access token using refresh token
// @route   GET /api/auth/refresh
// @access  Public (but requires refresh token cookie)
const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return next(new ErrorResponse("Not authorized, no refresh token", 401));
  }

  try {
    // Verify refresh token
    const decoded = verifyToken(refreshToken, true);

    // Check if user exists and refresh token matches
    const user = await User.findOne({
      _id: decoded.id,
      refreshToken,
    });

    if (!user) {
      return next(new ErrorResponse("Not authorized", 401));
    }

    // Generate new access token
    const { accessToken } = generateToken(user._id);

    // Set new access token cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return next(new ErrorResponse("Not authorized", 401));
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select(
    "-password -refreshToken"
  );

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Add/remove favorite country
// @route   PUT /api/auth/favorites
// @access  Private
const toggleFavoriteCountry = asyncHandler(async (req, res, next) => {
  const { countryCode } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  const index = user.favoriteCountries.indexOf(countryCode);

  if (index === -1) {
    // Add to favorites
    user.favoriteCountries.push(countryCode);
  } else {
    // Remove from favorites
    user.favoriteCountries.splice(index, 1);
  }

  await user.save();

  res.status(200).json({
    success: true,
    data: user.favoriteCountries,
  });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getMe,
  toggleFavoriteCountry,
};
