import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import rateLimit from "express-rate-limit";

const router = Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: "Too many authentication attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes
router.get("/csrf-token", authController.getCsrfToken); // Get CSRF token (no rate limit needed)
router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refresh);

export default router;
