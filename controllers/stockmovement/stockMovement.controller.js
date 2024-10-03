import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../middlewares/error.js";
import { StockMovement } from "../../models/stockMovement.Model.js";
import InventoryItem from "../../models/inventoryItem.Model.js";
import mongoose from "mongoose";
import { sendLowStockAlert, sendKafkaMessage } from "../../services/kafkaProducer.js";

export const recordStockMovement = catchAsyncErrors(async (req, res, next) => {
  const { item, type: movementType, quantityChange, user, notes } = req.body;

  // Validate required fields
  if (!item || !movementType || quantityChange === undefined || !user) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  const session = await mongoose.startSession(); // Start a session for the transaction
  session.startTransaction();

  try {
    // Find the inventory item by ID
    const inventoryItem = await InventoryItem.findById(item, null, { session });
    if (!inventoryItem) {
      await session.abortTransaction(); // Abort if item is not found
      return next(new ErrorHandler("Inventory item not found", 404));
    }

    // Determine stock adjustment based on movement type
    const stockAdjustment = (() => {
      switch (movementType) {
        case 'Purchase':
          return quantityChange;
        case 'Sale':
          if (inventoryItem.quantity < quantityChange) {
            throw new Error("Not enough items in stock");
          }
          return -quantityChange; // Decrease stock for sale
        case 'Return':
        case 'Adjustment':
          return quantityChange; // Adjust stock for return or adjustment
        default:
          throw new Error("Invalid movement type");
      }
    })();

    // Update inventory item with the stock adjustment
    const updatedItem = await InventoryItem.findByIdAndUpdate(
      item,
      { $inc: { quantity: stockAdjustment } },
      { new: true, session }
    ).populate("author");

    // Check if the updated quantity is below the low stock threshold
    if (updatedItem.quantity < updatedItem.lowStockThreshold) {
      const alertMessage = {
        recipientEmail: updatedItem.author.email,
        itemId: item,
        itemName: updatedItem.name,
        currentQuantity: updatedItem.quantity,
        threshold: updatedItem.lowStockThreshold,
        movementType,
        user: updatedItem.author.name,
        notes: updatedItem.description,
        quantityChange,
      };

      // Send low-stock alert to Kafka and email
      try {
        await sendKafkaMessage('low-stock-alerts', alertMessage);
        await sendLowStockAlert(alertMessage);
      } catch (alertError) {
        console.error("Error sending low stock alert:", alertError);
      }
    }

    // Record the stock movement in the database
    const stockMovement = await StockMovement.create(
      [{ item, type: movementType, quantityChange, user, notes }],
      { session }
    );

    await session.commitTransaction(); // Commit the transaction if all operations are successful

    res.status(201).json({
      success: true,
      message: "Stock movement recorded successfully",
      data: stockMovement[0],
    });
  } catch (error) {
    await session.abortTransaction(); // Abort the transaction on error
    return next(new ErrorHandler(error.message || "Server Error", 500));
  } finally {
    session.endSession(); // Ensure session is ended
  }
});


// Get all stock movements
export const getAllStockMovements = catchAsyncErrors(async (req, res, next) => {
  try {
    const stockMovements = await StockMovement.find()
      .populate("item")
      .populate("user");

    res.status(200).json({
      success: true,
      data: stockMovements,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to fetch stock movements", 500));
  }
});


// Get stock movements for a specific item
export const getStockMovementsByItem = catchAsyncErrors(async (req, res, next) => {
  const { itemId } = req.params;

  try {
    const stockMovements = await StockMovement.find({ item: itemId })
      .populate("user", "name email");

    if (!stockMovements.length) {
      return next(new ErrorHandler("No stock movements found for this item", 404));
    }

    res.status(200).json({
      success: true,
      data: stockMovements,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to retrieve stock movements for this item", 500));
  }
});

// Get a single stock movement by ID
export const getStockMovement = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  try {
    const stockMovement = await StockMovement.findById(id)
      .populate("item", "name")
      .populate("user", "name email");

    if (!stockMovement) {
      return next(new ErrorHandler("Stock movement not found", 404));
    }

    res.status(200).json({
      success: true,
      data: stockMovement,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to retrieve stock movement", 500));
  }
});

// Update a stock movement (only notes can be updated)
export const updateStockMovement = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { notes } = req.body;

  try {
    const stockMovement = await StockMovement.findById(id);
    if (!stockMovement) {
      return next(new ErrorHandler("Stock movement not found", 404));
    }

    // Update the notes field if provided
    stockMovement.notes = notes || stockMovement.notes;
    await stockMovement.save();

    res.status(200).json({
      success: true,
      message: "Stock movement updated successfully",
      data: stockMovement,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to update stock movement", 500));
  }
});

// Delete a stock movement
export const deleteStockMovement = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  try {
    const stockMovement = await StockMovement.findById(id);
    if (!stockMovement) {
      return next(new ErrorHandler("Stock movement not found", 404));
    }

    // Remove the stock movement record
    await stockMovement.remove();

    res.status(200).json({
      success: true,
      message: "Stock movement deleted successfully",
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to delete stock movement", 500));
  }
});
