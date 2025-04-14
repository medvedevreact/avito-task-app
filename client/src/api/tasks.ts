import axios from "axios";
import { Task, TaskStatus } from "../types";

const API_BASE_URL = "http://localhost:8080/api/v1";

export const TaskApi = {
  async fetchBoardTasks(boardId: string): Promise<Task[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/boards/${boardId}`);
      return response.data.data;
    } catch (error) {
      console.error("Ошибка при получении задач доски:", error);
      throw new Error("Не удалось загрузить задачи доски");
    }
  },

  async updateTaskStatus(taskId: number, newStatus: TaskStatus): Promise<void> {
    try {
      await axios.put(`${API_BASE_URL}/tasks/updateStatus/${taskId}`, {
        status: newStatus,
      });
    } catch (error) {
      console.error("Ошибка при обновлении статуса задачи:", error);
      throw new Error("Не удалось обновить статус задачи");
    }
  },
};
