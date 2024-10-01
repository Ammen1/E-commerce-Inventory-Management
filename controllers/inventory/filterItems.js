import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js";
import InventoryItem from "../../models/inventoryItem.Model.js";
import ErrorHandler from "../../middlewares/error.js";

export const filterItemsController = catchAsyncErrors(async (req, res, next) => {
  try {
    const { category = [], name = [], quantity = [] } = req.body;

    // Construct filter criteria
    const filterCriteria = {};
    if (category.length > 0) {
      filterCriteria.category = { $in: category };
    }
    if (name.length > 0) {
      filterCriteria.name = { $in: name };
    }
    if (quantity.length > 0) {
      filterCriteria.quantity = { $in: quantity };
    }

    // Fetch items with projection to limit returned fields
    const items = await InventoryItem.find(filterCriteria, 'name category price')
      .lean() // Return plain objects for performance
      .exec(); // Explicitly execute the query

    res.status(200).json({
      data: items,
      message: "Items retrieved successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message || "Server Error", 500));
  }
});
