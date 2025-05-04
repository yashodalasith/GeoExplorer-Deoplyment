const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, trim: true },
    email: { type: String, unique: true, lowercase: true },
    password: { type: String, select: false },
    firstName: { type: String },
    lastName: { type: String },
    countryOfResidence: { type: String },
    nationality: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String },
    favoriteCountries: { type: [String], default: [] },
    refreshToken: { type: String, select: false },
    lastLogout: { type: Date },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) {
    throw new Error("Password comparison failed - no password stored");
  }

  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error("Password comparison error:", error);
    return false;
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
