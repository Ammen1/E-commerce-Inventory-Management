import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../middlewares/error.js";
import InventoryItem from "../../models/inventoryItem.Model.js";

export const searchProduct = catchAsyncErrors(async (req, res, next) => {
  const query = req.query.q?.trim();
  
  // Default pagination values
  let page = Number(req.query.page) || 1;
  let limit = Number(req.query.limit) || 10;

  try {
    if (!query) {
      return next(new ErrorHandler("Search query cannot be empty", 400));
    }
    if (query.length < 3) {
      return next(new ErrorHandler("Search query must be at least 3 characters", 400));
    }

    // Calculate the number of items to skip for pagination
    const skip = (page - 1) * limit;

    // Use text search instead of regex for performance
    const items = await InventoryItem.find({
      $text: { $search: query }
    })
    .lean()
    .select('name category price')
    .skip(skip)
    .limit(limit);

    // Get total item count for pagination
    const totalItems = await InventoryItem.countDocuments({
      $text: { $search: query }
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalItems / limit);

    if (!items.length) {
      return res.status(200).json({
        data: [],
        message: "No items found",
        success: true,
        page,
        totalPages,
        totalItems
      });
    }

    res.status(200).json({
      data: items,
      message: "Search results",
      success: true,
      page,
      totalPages,
      totalItems,
    });
  } catch (error) {
    console.error('Error searching product:', error);
    return next(new ErrorHandler(error.message || "Server error", 500));
  }
});
