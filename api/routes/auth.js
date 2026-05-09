
import express from 'express';
import { checkResetToken, forgotPassword, login, resetPassword, verify } from '../controllers/authController.js';
import verifyUser from '../middleware/authMiddleware.js';


const router = express.Router();


router.post("/login",login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/check-reset-token/:token" , checkResetToken)
router.get("/verify",verifyUser,verify);


export default router;



