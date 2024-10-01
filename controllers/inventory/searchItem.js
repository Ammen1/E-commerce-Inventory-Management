import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../middlewares/error.js";
import InventoryItem from "../../models/inventoryItem.Model.js";

export const searchProduct = catchAsyncErrors(async (req, res, next) => {
  const query = req.query.q?.trim();

  if (!query) {
    return next(new ErrorHandler("Search query cannot be empty", 400));
  }

  const regex = new RegExp(query, 'i');
  const items = await InventoryItem.find({
    "$or": [
      { name: regex },
      { category: regex }
    ]
  }).limit(50);  
  res.status(200).json({
    data: items,
    message: "Search Item list",
    success: true
  });
});
