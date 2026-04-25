import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { authService } from "../services/auth.service";
import { registerSchema, loginSchema } from "../schemas/validation";
import { config } from "../config/env";

export const authController = {
  async register(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const input = registerSchema.parse(req.body);
      const user = await authService.register(input);

      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({
          error: "Validation error",
          details: error.errors,
        });
        return;
      }

      res.status(400).json({
        error: error.message || "Registration failed",
      });
    }
  },

  async login(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const input = loginSchema.parse(req.body);
      const result = await authService.login(input);

      // Set refresh token in HTTP-only cookie
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: config.isProduction,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({
          error: "Validation error",
          details: error.errors,
        });
        return;
      }

      res.status(401).json({
        error: error.message || "Login failed",
      });
    }
  },

  async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // Clear refresh token cookie
      res.clearCookie("refreshToken");

      res.json({
        message: "Logged out successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        error: error.message || "Logout failed",
      });
    }
  },

  async refresh(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        res.status(401).json({
          error: "Refresh token not found",
        });
        return;
      }

      const { verifyRefreshToken, generateAccessToken } = await import("../utils/token");
      const payload = verifyRefreshToken(refreshToken);

      if (!payload) {
        res.status(401).json({
          error: "Invalid or expired refresh token",
        });
        return;
      }

      const newAccessToken = generateAccessToken({
        userId: payload.userId,
        email: payload.email,
      });

      res.json({
        accessToken: newAccessToken,
      });
    } catch (error: any) {
      res.status(500).json({
        error: error.message || "Token refresh failed",
      });
    }
  },

  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const user = await authService.getUserById(req.userId);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json(user);
    } catch (error: any) {
      res.status(500).json({
        error: error.message || "Failed to fetch profile",
      });
    }
  },
};
