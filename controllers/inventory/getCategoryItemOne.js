import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../middlewares/error.js";
import InventoryItem from "../../models/inventoryItem.Model.js";

export const getCategoryItem = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get distinct categories
    const itemCategories = await InventoryItem.distinct("category");

    // Fetch items for each category in parallel
    const itemByCategory = await Promise.all(
      itemCategories.map(async (category) => {
        const item = await InventoryItem.findOne({ category });
        return item ? item : null; 
      })
    );

    // Filter out null values
    const filteredItems = itemByCategory.filter(Boolean);

    res.status(200).json({
      message: "Category items retrieved successfully",
      data: filteredItems,
      success: true,
      error: false,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message || "Server Error", 500));
  }
});
