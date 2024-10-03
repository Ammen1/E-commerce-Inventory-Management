import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js";
import User from "../../models/user.Model.js";
import ErrorHandler from "../../middlewares/error.js";
import { sendToken } from "../../utils/jwtToken.js";
import { passwordResetTemplate } from "../../services/emailTemplates.js";
import { sendMail } from "../../services/common.js";
import crypto from 'crypto';


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
    // Validate phone number (10 digits, can start with 0)
    const phoneRegex = /^(0\d{9}|\d{10})$/;
    if (!phoneRegex.test(phone)) {
      return next(new ErrorHandler("Phone number must be exactly 10 digits!", 400));
    }
    const userData = {
      name,
      email,
      phone: phone.toString(),
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



export const resetPasswordRequest = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler('User not found with this email', 404));
  }

  // Check if user status is disabled
  if (user.isActive === false) {
    return next(new ErrorHandler("Your account is disabled. Please contact support.", 403));
  }

  // Generate a reset token
  const token = crypto.randomBytes(48).toString('hex');
  console.log("Take this token then enter on swagger to reset password:", token);

  user.passwordResetToken = token;
  await user.save();

  // Create the reset password link
  const resetPageLink = `http://localhost:5000/api-docs/#/Auth/post_api_v1_users_reset_password`;
  const subject = 'Password Reset Request for my account';
  const html = passwordResetTemplate(resetPageLink);

  // Send email with reset link
  const response = await sendMail({ to: email, subject, html });
  res.json({ success: true, message: 'Password reset email sent', response });
});


export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { email, password, token } = req.body;

  // Find the user with the provided email and token
  const user = await User.findOne({ email, passwordResetToken: token });

  if (!user) {
    return next(new ErrorHandler('Invalid token or email', 400));
  }

  // Update the user with the new password
  user.password = password;
  user.passwordResetToken = null;

  await user.save();

  // Send confirmation email
  const subject = 'Password successfully reset';
  const html = `<p>You have successfully reset your password.</p>`;
  await sendMail({ to: email, subject, html });

  res.json({ success: true, message: 'Password successfully reset' });
});
