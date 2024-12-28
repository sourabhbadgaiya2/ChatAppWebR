import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import User from "../models/user.models.js";

export const getUserForSideBar = catchAsyncError(async (req, res, next) => {
  const loggedInUserId = req.user._id;

  const filteredUsers = await User.find({
    _id: { $ne: loggedInUserId },
  }).select("-password");

  res.status(200).json(filteredUsers);
});

