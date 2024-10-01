import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";

// Middleware to check user role
export const authorizeRoles = (...roles) => {
  return catchAsyncErrors(async (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ErrorHandler('Access denied: insufficient permissions', 403));
    }
    next();
  });
};
