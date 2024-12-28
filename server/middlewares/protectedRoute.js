import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandlers.js";
import User from "../models/user.models.js";
import { catchAsyncError } from "./catchAsyncError.js";

const ProtectRoute = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    next(new ErrorHandler("Unauthorized - No Token Provided", 401));
  }

  const decode = jwt.verify(token, process.env.JWT_SEC);
  if (!decode) {
    next(new ErrorHandler("Unauthorized - Invalid Token", 401));
  }

  const user = await User.findById(decode.userId).select("-password");
  if (!user) {
    next(new ErrorHandler("User Not Found", 404));
  }

  req.user = user;
  next();
});

export default ProtectRoute;
