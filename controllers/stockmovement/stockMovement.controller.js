import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../middlewares/error.js";
import { StockMovement } from "../../models/stockMovement.Model.js";
import InventoryItem from "../../models/inventoryItem.Model.js";
import mongoose from "mongoose";
import { sendLowStockAlert, sendKafkaMessage } from "../../services/kafkaProducer.js"; // Import both functions

export const recordStockMovement = catchAsyncErrors(async (req, res, next) => {
  const { item, type, quantityChange, user, notes } = req.body;

  // Validate required fields
  if (!item || !type || quantityChange === undefined || !user) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  const session = await mongoose.startSession(); // Start a session for the transaction
  session.startTransaction();

  try {
    const inventoryItem = await InventoryItem.findById(item, null, { session });

    if (!inventoryItem) {
      await session.abortTransaction(); // Abort the transaction if item is not found
      return next(new ErrorHandler("Inventory item not found", 404));
    }

    // Determine stock adjustment based on movement type
    let stockAdjustment = 0;
    switch (type) {
      case 'Purchase':
        stockAdjustment = quantityChange;
        break;
      case 'Sale':
        if (inventoryItem.quantity < quantityChange) {
          await session.abortTransaction();
          return next(new ErrorHandler("Not enough items in stock", 400));
        }
        stockAdjustment = -quantityChange;
        break;
      case 'Return':
      case 'Adjustment':
        stockAdjustment = quantityChange;
        break;
      default:
        await session.abortTransaction();
        return next(new ErrorHandler("Invalid movement type", 400));
    }

    // Update inventory item with the stock adjustment
    const updatedItem = await InventoryItem.findByIdAndUpdate(
      item,
      { $inc: { quantity: stockAdjustment } },
      { new: true, session }
    );

    // Check for low stock condition
    if (updatedItem.quantity < updatedItem.lowStockThreshold) {
      // Prepare alert message for Kafka
      const alertMessage = {
        recipientEmail: 'amenguda@gmail.com',
        itemId: item,
        itemName: updatedItem.name,
        currentQuantity: updatedItem.quantity,
        threshold: updatedItem.lowStockThreshold,
        user,
      };

      // Send low-stock alert to Kafka
      await sendKafkaMessage('low-stock-alerts', alertMessage); // Send message to Kafka topic
      await sendLowStockAlert(alertMessage);
    }

    // Record the stock movement in the database
    const stockMovement = await StockMovement.create(
      [{ item, type, quantityChange, user, notes }],
      { session }
    );

    await session.commitTransaction(); // Commit transaction if all operations are successful

    res.status(201).json({
      success: true,
      message: "Stock movement recorded successfully",
      data: stockMovement[0],
    });
  } catch (error) {
    await session.abortTransaction();
    return next(new ErrorHandler(error.message || "Server Error", 500));
  } finally {
    session.endSession(); // Ensure session is ended
  }
});
