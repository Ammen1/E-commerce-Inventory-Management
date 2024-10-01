import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../middlewares/error.js";
import InventoryItem from "../../models/inventoryItem.Model.js";

export const searchProduct = catchAsyncErrors(async (req, res, next) => {
  const query = req.query.q?.trim();

  if (!query) {
    return next(new ErrorHandler("Search query cannot be empty", 400));
  }

  // Use regex for case-insensitive search
  const regex = new RegExp(query, 'i');
  
  // Fetch items matching the search query
  const items = await InventoryItem.find({
    "$or": [
      { name: regex },
      { category: regex }
    ]
  })
    .lean()
    .select('name category price')
    .limit(50);

  res.status(200).json({
    data: items,
    message: "Search item list",
    success: true
  });
});
