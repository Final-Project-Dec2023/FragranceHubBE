import express from 'express';
import { createProduct, deleteProductById, getAllProducts, getBySlug, getProductById, processPayment, relatedProduct, searchProduct, updateProduct} from '../controllers/product.js';
import { upload } from '../helpers/multer.js';
import { isLoggedIn } from '../middlewares/auth.js';
import { orderStatus } from '../controllers/order.js';

const router = express.Router();

router.post('/create', upload.array('images', 5), createProduct);
router.put("/update/:productId", upload.array('images', 5), updateProduct)

router.get("/all", getAllProducts)
router.get("/:productId", getProductById)
router.get("/slug/:slug", getBySlug)
router.delete("/:productId", deleteProductById)
router.post("/search", searchProduct)
router.get("/related/:productId", relatedProduct)

//payments
router.post("/payment", isLoggedIn, processPayment)

// orders
router.put("/order-status/:orderId", orderStatus)


export default router;
