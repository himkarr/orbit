const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

function createToken(userId) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured.");
  return jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: "7d"});
}

function userResponse(user) {
  return {
    user: {id: user._id, username: user.username, email: user.email},
    token: createToken(user._id),
  };
}

router.post("/register", async (req, res, next) => {
  try {
    const {username, email, password} = req.body;
    if (!username?.trim() || !email?.trim() || !password)
      return res
        .status(400)
        .json({error: "Username, email, and password are required."});
    if (password.length < 8)
      return res
        .status(400)
        .json({error: "Password must be at least 8 characters."});

    const existingUser = await User.findOne({email: email.toLowerCase()});
    if (existingUser)
      return res
        .status(409)
        .json({error: "An account with this email already exists."});

    const user = await User.create({username, email, password});
    return res.status(201).json(userResponse(user));
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const {email, password} = req.body;
    if (!email?.trim() || !password)
      return res.status(400).json({error: "Email and password are required."});

    const user = await User.findOne({email: email.toLowerCase()}).select(
      "+password",
    );
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({error: "Invalid email or password."});

    return res.json(userResponse(user));
  } catch (error) {
    return next(error);
  }
});

router.get("/me", protect, (req, res) =>
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
    },
  }),
);

module.exports = router;
