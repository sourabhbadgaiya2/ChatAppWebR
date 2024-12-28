import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import ErrorHandler from "../utils/ErrorHandlers.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";

export const signup = catchAsyncError(async (req, res, next) => {
  const { fullName, username, password, confirmPassword, gender } = req.body;

  if (password !== confirmPassword) {
    return next(new ErrorHandler("Password Don't Match", 400));
  }

  const user = await User.findOne({ username });
  if (user) {
    return next(new ErrorHandler("user already exists", 409));
  }

  //! HASh PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
  const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

  const newUser = new User({
    fullName,
    username,
    gender,
    password: hashPassword,
    profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
  });

  // Token Generated
  await generateTokenAndSetCookie(newUser._id, res);

  await newUser.save();

  res.status(201).json({
    _id: newUser._id,
    fullName: newUser.fullName,
    username: newUser.username,
    profilePic: newUser.profilePic,
  });

  if (!newUser) {
    next(new ErrorHandler("Invalid user data", 400));
  }
});

export const login = catchAsyncError(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  const isPasswordCorrect = await bcrypt.compare(
    password,
    user?.password || ""
  );
  if (!user || !isPasswordCorrect) {
    next(new ErrorHandler("Invalid username or password", 400));
  }
  generateTokenAndSetCookie(user._id, res);
  res.status(200).json({
    _id: user._id,
    fullName: user.fullName,
    username: user.username,
    profilePic: user.profilePic,
  });
});

export const logout = catchAsyncError((req, res, next) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully" });
});
