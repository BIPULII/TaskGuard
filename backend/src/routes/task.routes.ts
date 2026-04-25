import { Router } from "express";
import { taskController } from "../controllers/task.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// All task routes require authentication
router.use(authMiddleware);

// Task routes
router.get("/", taskController.getTasks);
router.get("/stats", taskController.getTaskStats);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

export default router;
