import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../middlewares/error.js";
import InventoryItem from "../../models/inventoryItem.Model.js";
import Order from "../../models/order.Model.js";
import { sendOrderNotification } from "../../services/kafkaProducer.js";
import mongoose from "mongoose";

// Function to send notifications for large orders or out-of-stock items
async function handleImportantNotifications(order) {
  const largeOrderThreshold = 5000;
  const outOfStockItems = [];

  // Check if the order qualifies as a "large order"
  if (order.totalAmount >= largeOrderThreshold) {
    order.importantTransaction = true;

    // Send notification for large order
    await sendOrderNotification({
      type: "large-order",
      message: `A large order with a total of birr ${order.totalAmount} has been placed. `,

    });
  }

  // Check for out-of-stock items
  for (const item of order.items) {
    const inventoryItem = await InventoryItem.findById(item.product).populate("author");;
    if (inventoryItem && inventoryItem.quantity < item.quantity) {
      outOfStockItems.push(inventoryItem.name);

      // Send notification for out-of-stock item
      await sendOrderNotification({
        type: "out-of-stock",
        message: `Item ${inventoryItem.name} is out of stock.\nDescriptions ${inventoryItem.description}.\nCategory: ${inventoryItem.category}.\nUser ${inventoryItem.author.email}`,
      });
    }
  }

  // Save any updates to the order
  await order.save();
}

export const createOrder = catchAsyncErrors(async (req, res, next) => {
  const { customer, items } = req.body;

  if (!customer || !items || items.length === 0) {
    return next(new ErrorHandler("Customer and items are required", 400));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let totalAmount = 0;
    const orderItems = [];

    // Calculate total amount and prepare order items
    for (const item of items) {
      const product = await InventoryItem.findById(item.product);
      if (!product) {
        await session.abortTransaction();
        return next(new ErrorHandler("Product not found", 404));
      }

      const subtotal = item.quantity * product.price;
      totalAmount += subtotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        subtotal,
      });

      // Decrease stock quantity
      await InventoryItem.findByIdAndUpdate(
        product._id,
        { $inc: { quantity: -item.quantity } },
        { session }
      );
    }

    // Create the order
    const order = await Order.create(
      [
        {
          customer,
          items: orderItems,
          totalAmount,
          customer
        },
      ],
      { session }
    );

    // Log the created order for debugging
    console.log("Order created:", order); 

    // Handle notifications for important transactions
    await handleImportantNotifications(order[0]);

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        _id: order[0]._id,  // Include the order ID
        customer,
        items: orderItems,
        totalAmount,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error creating order:", error);  // Log the error
    return next(new ErrorHandler(error.message || "Server Error", 500));
  } finally {
    session.endSession();
  }
});


// Controller for updating order status
export const updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const { orderId, status } = req.body;

  // Validate input
  if (!orderId || !status) {
    return next(new ErrorHandler("Order ID and status are required", 400));
  }

  const allowedStatuses = ["Pending", "Processing", "Shipped", "Completed", "Cancelled"];
  if (!allowedStatuses.includes(status)) {
    return next(new ErrorHandler("Invalid status", 400));
  }

  // Update order status
  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    data: order,
  });
});


// Get all orders
export const getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();

    // Check if orders were found
    if (!orders.length) {
        return next(new ErrorHandler("No orders found", 404));
    }

    res.status(200).json({
        success: true,
        count: orders.length,
        data: orders,
    });
});

// Get a single order by ID
export const getOrderById = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.orderId);

    // Check if the order exists
    if (!order) {
        return next(new ErrorHandler("Order not found", 404));
    }

    res.status(200).json({
        success: true,
        data: order,
    });
});

// Delete an order
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findByIdAndDelete(req.params.orderId);

    // Check if the order was found and deleted
    if (!order) {
        return next(new ErrorHandler("Order not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Order deleted successfully",
    });
});

// Controller to get orders by customer ID
export const getOrdersByCustomerId = catchAsyncErrors(async (req, res) => {
  const { customerId } = req.params;

  try {
    const orders = await Order.find({ customer: customerId }).populate('items.product', 'name');

    if (orders.length === 0) {
      return next(new ErrorHandler("No orders found for this customer", 404))
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error retrieving orders:', error);
    res.status(500).json({ message: 'An error occurred while retrieving orders.', error: error.message });
    return next(new ErrorHandler(error.message || "Server Error", 500))
  }
});