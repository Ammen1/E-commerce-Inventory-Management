import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js";
import User from "../../models/user.Model.js";
import ErrorHandler from "../../middlewares/error.js";
import { sendToken } from "../../utils/jwtToken.js";


export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, password, role} = req.body;


  if (!name || !email || !phone || !password) {
    return next(new ErrorHandler("Please fill all required fields!", 400));
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("Email already registered!", 400));
    }

    const userData = {
      name,
      email,
      phone,
      password, 
      role,
    };

    // Create new user
    const user = await User.create(userData);
    sendToken(user, 201, res, "User Registered!");

  }
   catch (error) {
    console.error("Error:", error);
    return next(new ErrorHandler("Failed to register user.", 500));
  }
});


export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide email ,password and role."));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }
  if (user.role !== role) {
    return next(
      new ErrorHandler(`User with provided email and ${role} not found!`, 404)
    );
  }
  sendToken(user, 201, res, "User Logged In!");
});