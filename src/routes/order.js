import express from "express";
import {orderStatus, getAllOrders, searchOrdersByDate, getOrderById, deleteOrder} from "../controllers/order.js"


const router = express.Router();


router.put("/status/:orderId", orderStatus)
router.get("/all", getAllOrders)
router.get("/:orderId", getOrderById)
router.get("/search/:orderId", searchOrdersByDate)
router.delete("/:orderId", deleteOrder)


export default router;