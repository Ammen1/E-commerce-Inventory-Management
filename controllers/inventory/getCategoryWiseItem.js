import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../middlewares/error.js";
import InventoryItem from "../../models/inventoryItem.Model.js";

export const getCategoryWiseItem = catchAsyncErrors(async (req, res, next) => {
  const category = req.body?.category || req.query?.category;

  // Validate that the category is provided
  if (!category) {
    return next(new ErrorHandler("Category is required", 400));
  }

  try {
    // lean() for better performance by returning plain JavaScript objects
    const items = await InventoryItem.find({ category }).lean().exec();

    res.status(200).json({
      success: true,
      message: items.length > 0 ? "Items retrieved successfully" : "No items found for this category",
      data: items,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message || "Server Error", 500));
  }
});
