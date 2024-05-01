//controllers/order.js
import Order from "../models/order.js";

// Function to create a new order
export const createOrder = async (
  items,
  newTransaction,
  buyerId,
  totalAmount
) => {
  try {
    // Create new order
    const order = new Order({
      products: items,
      payment: newTransaction,
      buyer: buyerId,
      totalAmount: totalAmount,
    });

    // Save the order
    await order.save();

    // Populate the products field with details of each product
    await order.populate("products._id").execPopulate();

    console.log("Order created successfully");
    return order;
  } catch (err) {
    console.error("Error creating order:", err.message);
  }
};

// Controller function to update order status by orderId
export const orderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({
      success: true,
      message: `Your order status has been changed to "${status}"`,
      orderStatus: order.status,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Controller function to get all orders with pagination
export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find().skip(skip).limit(limit);
    const totalOrders = await Order.countDocuments();

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      orderCount: totalOrders,
      orders,
    });
  } catch (err) {
    console.error("Error fetching all orders:", err.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch orders",
        error: err.message,
      });
  }
};

// Controller function to get order by orderId
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("Error fetching order by ID:", err.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch order",
        error: err.message,
      });
  }
};

// Controller function to delete order by orderId
export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res
      .status(200)
      .json({
        success: true,
        message: `Order ID: ${orderId} deleted successfully`,
      });
  } catch (err) {
    console.error("Error deleting order by ID:", err.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to delete order",
        error: err.message,
      });
  }
};

// Controller function to search orders by date or date range with pagination
export const searchOrdersByDate = async (req, res) => {
  const { startDate, endDate } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    let query = {};

    // Check if both startDate and endDate parameters are provided
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      // If only startDate is provided, search orders created on or after startDate
      query.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      // If only endDate is provided, search orders created on or before endDate
      query.createdAt = { $lte: new Date(endDate) };
    }

    // Search orders based on the constructed query
    const orders = await Order.find(query).skip(skip).limit(limit);
    const totalOrders = await Order.countDocuments(query);

    res.json({
      currentPage: page,
      ordersFound: totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      orders,
    });
  } catch (err) {
    console.error("Error searching orders by date:", err.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to search orders",
        errorMsg: err.message,
      });
  }
};