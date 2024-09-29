import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../middlewares/error.js";
import InventoryItem from "../../models/inventoryItem.Model.js";

export const CreateInventory = catchAsyncErrors(async (req, res, next) => {
  const { name, description, category, price, quantity, lowStockThreshold, author } = req.body;

  // Validate required fields
  if (!name || !category || !price || !quantity) {
    return next(new ErrorHandler('Please provide all required fields (name, category, price, quantity)', 400));
  }

  // Check if inventory item with the same name already exists
  const existingItem = await InventoryItem.findOne({ name });
  if (existingItem) {
    return next(new ErrorHandler('An inventory item with this name already exists', 409));
  }

  // Create a new inventory item
  const newItem = await InventoryItem.create({
    name,
    description,
    category,
    price,
    quantity,
    lowStockThreshold,
    author,
  });

  res.status(201).json({
    success: true,
    message: "Inventory item created successfully",
    data: newItem
  });
});

export const getAll = catchAsyncErrors(async (req, res, next) => {
    try {
      const inventoryItems = await InventoryItem.find();
      res.status(200).json({
        success: true,
        count: inventoryItems.length,
        data: inventoryItems
      });
    } catch (error) {
      return next(new ErrorHandler('Unable to fetch inventory items', 500));
    }
  });
  