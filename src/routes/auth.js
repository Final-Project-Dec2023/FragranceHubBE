import express from 'express';
import { register, login } from '../controllers/auth.js';
import { upload } from '../helpers/multer.js';
import { getAllUsers, getOneUser, updateUser } from '../controllers/user.js';
import { isLoggedIn } from '../middlewares/auth.js';

const router = express.Router();

// routes
router.post('/register', upload.single('image'), register)
router.post('/login', login)

// User routes
router.get("/users", getAllUsers)
router.get("/user/:userId", getOneUser)
router.put("/user/update", isLoggedIn, upload.single("image"),  updateUser)



export default router