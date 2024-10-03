import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../middlewares/error.js";
import InventoryItem from "../../models/inventoryItem.Model.js";

export const getCategoryWiseItem = catchAsyncErrors(async (req, res, next) => {
  const category = req.body?.category || req.query?.category;

  // Check if the category is provided
  if (!category) {
    return next(new ErrorHandler("Category parameter is required", 400));
  }

  try {
    // Fetch items in the given category with performance optimization using lean()
    const items = await InventoryItem.find({ category }).lean();

    // Send response based on the result
    res.status(200).json({
      success: true,
      message: items.length > 0 ? "Items retrieved successfully" : "No items found for the specified category",
      data: items,
      error: false,
    });
  } catch (error) {
    // Error handling in case something goes wrong
    return next(new ErrorHandler(error.message || "Server Error", 500));
  }
});
