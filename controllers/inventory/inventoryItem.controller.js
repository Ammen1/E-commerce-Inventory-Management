import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../middlewares/error.js";
import InventoryItem from "../../models/inventoryItem.Model.js";
import mongoose from "mongoose";

export const CreateInventory = catchAsyncErrors(async (req, res, next) => {
  const { name, description, category, price, quantity, lowStockThreshold, author } = req.body;

  try {
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

    } catch (error) {
      return next(new ErrorHandler(error.message || 'Server Error', 500))
    }
});


// Get All Inventory Items with Search & Filters
export const getAllInventoryItems = catchAsyncErrors(async (req, res, next) => {
  const { name, category, minQuantity, maxQuantity, page = 1, limit = 10 } = req.query;

  const filterCriteria = {};

  try {
    if (name) {
      filterCriteria.name = { $regex: name, $options: 'i' }; // Case-insensitive search
    }

    // Filter by category
    if (category) {
      filterCriteria.category = category;
    }

    // Filter by quantity range
    if (minQuantity || maxQuantity) {
      filterCriteria.quantity = {};
      if (minQuantity) {
        const min = parseInt(minQuantity);
        if (isNaN(min)) {
          return next(new ErrorHandler('Invalid minQuantity value', 400));
        }
        filterCriteria.quantity.$gte = min;
      }
      if (maxQuantity) {
        const max = parseInt(maxQuantity);
        if (isNaN(max)) {
          return next(new ErrorHandler('Invalid maxQuantity value', 400));
        }
        filterCriteria.quantity.$lte = max;
      }
    }

    // Pagination setup
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const items = await InventoryItem.find(filterCriteria)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Fetch the total number of items matching the filter
    const totalItems = await InventoryItem.countDocuments(filterCriteria);
    res.status(200).json({
      success: true,
      count: items.length,
      totalItems,
      currentPage: pageNum,
      totalPages: Math.ceil(totalItems / limitNum),
      data: items,
    });
  } catch (error) {
    return next(new ErrorHandler('Server Error', 500));
  }
});

export const getInventoryItem = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  try {
    // Validate the ID format
    if (!mongoose.isValidObjectId(id)) {
      return next(new ErrorHandler('Invalid inventory item ID', 400));
    }
    const item = await InventoryItem.findById(id).populate('author');

    if (!item) {
      return next(new ErrorHandler('Inventory item not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Inventory item found by ID',
      data: item,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message || 'Server error', 500));
  }
});

export const updateInventoryItem = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { name, description, category, price, quantity, lowStockThreshold } = req.body;

  try {
    // Validate the ID format
    if (!mongoose.isValidObjectId(id)) {
      return next(new ErrorHandler('Invalid inventory item ID', 400));
    }
    const item = await InventoryItem.findByIdAndUpdate(
      id,
      { name, description, category, price, quantity, lowStockThreshold },
      { new: true, runValidators: true }
    );

    if (!item) {
      return next(new ErrorHandler('Inventory item not found', 404));
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Inventory item updated successfully',
      data: item,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message || 'Server error', 500));
  }
});


  export const deleteInventoryItem = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return next(new ErrorHandler('Invalid inventory item ID', 400));
    }

    const deletedItem = await InventoryItem.findByIdAndDelete(id);

    if (!deletedItem) {
        return next(new ErrorHandler('Inventory item not found', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Inventory item deleted successfully',
        data: deletedItem,
    });
});