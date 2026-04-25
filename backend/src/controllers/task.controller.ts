import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { taskService } from "../services/task.service";
import { createTaskSchema, updateTaskSchema } from "../schemas/validation";

export const taskController = {
  async getTasks(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { status, priority } = req.query;
      const tasks = await taskService.getUserTasks(
        req.userId,
        status as string,
        priority as string
      );

      res.json({ tasks });
    } catch (error: any) {
      res.status(500).json({
        error: error.message || "Failed to fetch tasks",
      });
    }
  },

  async getTaskStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const stats = await taskService.getTaskStats(req.userId);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({
        error: error.message || "Failed to fetch task stats",
      });
    }
  },

  async createTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const input = createTaskSchema.parse(req.body);
      const task = await taskService.createTask(req.userId, input);

      res.status(201).json(task);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({
          error: "Validation error",
          details: error.errors,
        });
        return;
      }

      res.status(500).json({
        error: error.message || "Failed to create task",
      });
    }
  },

  async updateTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { id } = req.params;
      const input = updateTaskSchema.parse(req.body);
      const task = await taskService.updateTask(id, req.userId, input);

      res.json(task);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({
          error: "Validation error",
          details: error.errors,
        });
        return;
      }

      if (error.message?.includes("Unauthorized")) {
        res.status(403).json({
          error: error.message,
        });
        return;
      }

      res.status(500).json({
        error: error.message || "Failed to update task",
      });
    }
  },

  async deleteTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { id } = req.params;
      const result = await taskService.deleteTask(id, req.userId);

      res.json(result);
    } catch (error: any) {
      if (error.message?.includes("Unauthorized")) {
        res.status(403).json({
          error: error.message,
        });
        return;
      }

      res.status(500).json({
        error: error.message || "Failed to delete task",
      });
    }
  },
};
