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
      throw new Error("Failed to create order");
    }
  };
  
  // Process payment function
  export const processPayment = async (req, res) => {
    try {
      // Payment reference and cart items
      const { paymentRef, cartItems } = req.body;
  
      // Validations
      if (paymentRef === null || paymentRef === undefined) {
        return res.json({ success: false, message: "Payment ref is required" });
      }
      if (!cartItems.length > 0) {
        return res.json({ success: false, message: "No cart or cart is empty" });
      }
  
      // Fetch each product from the DB and calculate the total
      let total = 0;
      const orderedProducts = [];
      for (let i = 0; i < cartItems.length; i++) {
        const product = await Product.findById(cartItems[i]);
        if (!product) {
          return res.json({ success: false, message: `Product with ID ${cartItems[i]} not found` });
        }
        total += product.price;
        orderedProducts.push({
          _id: product._id,
          name: product.name,
          price: product.price,
        });
      }
  
      console.log("Total:", total);
  
      // Initialize payment gateway
      let newTransaction = {
        amount: total,
        paymentStatus: paymentRef,
      };
  
      // If payment is successful, create new order
      if (newTransaction.paymentStatus === true) {
        // Call createOrder function to create new order
        const order = await createOrder(orderedProducts, newTransaction, req.user._id, total);
  
        console.log("Payment Successful, order created");
        return res.json({ success: true, message: "Payment successful, order created", order });
      } else {
        console.log("Payment Failed, no order created");
        return res.json({ success: false, message: "Payment failed, order not created" });
      }
  
    } catch (err) {
      console.error("Payment failed, order not created", err.message);
      res.status(500).json({ success: false, message: "Payment failed, order not created", error: err.message });
    }
  };
  