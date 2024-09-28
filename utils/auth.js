import User from "../models/user.Model.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies?.token;

  // Helper function to handle errors
  const handleError = (message, statusCode = 401) => next(new ErrorHandler(message, statusCode));

  if (!token) {
    return handleError("Authentication required. Please log in.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id).select("-password"); 
    if (!user) {
      return handleError("User not found. Invalid token.", 404);
    }

    req.user = user;
    next();
  } catch (error) {
    handleError("Invalid or expired token. Please log in again.");
  }
});
