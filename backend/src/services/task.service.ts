import { PrismaClient } from "@prisma/client";
import { CreateTaskInput, UpdateTaskInput } from "../schemas/validation";

const prisma = new PrismaClient();

export const taskService = {
  async getUserTasks(userId: string, status?: string, priority?: string) {
    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return tasks;
  },

  async getTaskById(taskId: string, userId: string) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new Error("Task not found");
    }

    if (task.userId !== userId) {
      throw new Error("Unauthorized: You can only access your own tasks");
    }

    return task;
  },

  async createTask(userId: string, input: CreateTaskInput) {
    const task = await prisma.task.create({
      data: {
        title: input.title,
        description: input.description,
        status: input.status || "TODO",
        priority: input.priority || "MEDIUM",
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        userId,
      },
    });

    return task;
  },

  async updateTask(taskId: string, userId: string, input: UpdateTaskInput) {
    // First verify task ownership
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new Error("Task not found");
    }

    if (task.userId !== userId) {
      throw new Error("Unauthorized: You can only update your own tasks");
    }

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: input.title,
        description: input.description,
        status: input.status,
        priority: input.priority,
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
      },
    });

    return updatedTask;
  },

  async deleteTask(taskId: string, userId: string) {
    // First verify task ownership
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new Error("Task not found");
    }

    if (task.userId !== userId) {
      throw new Error("Unauthorized: You can only delete your own tasks");
    }

    // Delete task
    await prisma.task.delete({
      where: { id: taskId },
    });

    return { message: "Task deleted successfully" };
  },

  async getTaskStats(userId: string) {
    const tasks = await prisma.task.findMany({
      where: { userId },
    });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
    const pendingTasks = tasks.filter((t) => t.status !== "COMPLETED").length;
    const highPriorityTasks = tasks.filter((t) => t.priority === "HIGH").length;

    const now = new Date();
    const overdueTasks = tasks.filter(
      (t) => t.dueDate && t.dueDate < now && t.status !== "COMPLETED"
    ).length;

    const todayTasks = tasks.filter((t) => {
      if (!t.dueDate) return false;
      const taskDate = new Date(t.dueDate);
      return (
        taskDate.getDate() === now.getDate() &&
        taskDate.getMonth() === now.getMonth() &&
        taskDate.getFullYear() === now.getFullYear()
      );
    }).length;

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      highPriorityTasks,
      overdueTasks,
      todayTasks,
    };
  },
};
