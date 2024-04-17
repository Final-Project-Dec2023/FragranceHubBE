import Order from "../models/order.js";

const createOrder = async (items, newTransaction, buyerId, totalAmount) => {
    try {
      // Create new order
      const order = new Order({
        products: items,
        payment: newTransaction,
        buyer: buyerId,
        totalAmount: totalAmount
      });
  
      // Save the order
      await order.save();
  
      // Populate the products field with details of each product
      await order.populate('products._id').execPopulate();
  
      console.log("Order created successfully");
      return order;
    } catch (err) {
      console.error("Error creating order:", err.message);
    }
  };
  

  export const orderStatus = async(req, res)=>{
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      const order = await Order.findByIdAndUpdate(orderId, { status}, {new: true});

      if(!order){
        return res.status(404).json({success: false, message: "Order not found"});
      }

      res.json({success: true, message: `Your order status has been changed to "${status}"`, orderStatus: order.status})
    } catch (err){
      console.log(err);
      return res.status(500).json({success: false, message: err.message});
      
    }
  }

  // create the following endpoints

  // getAllOrders

  // getOrderById

  // deleteOrder

  // searchOrdersByDate















  