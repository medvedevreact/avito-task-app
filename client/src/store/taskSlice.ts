import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Task, TaskPriority, TaskStatus } from "../types";
import toast from "react-hot-toast";

interface TasksState {
  tasks: Task[];
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  fetchStatus: "idle",
  createStatus: "idle",
  updateStatus: "idle",
  error: null,
};

type CreateTaskPayload = {
  title: string;
  description: string;
  boardId: number;
  priority: TaskPriority;
  status: TaskStatus;
  assigneeId: number;
};

type UpdateTaskPayload = {
  taskId: number;
  taskData: {
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    assigneeId: number;
  };
};

const API_BASE_URL = "http://localhost:8080/api/v1/tasks";

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  try {
    const response = await axios.get<{ data: Task[] }>(API_BASE_URL);
    return response.data.data;
  } catch (error) {
    toast.error("Не удалось загрузить задачи.");
    throw error;
  }
});

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (payload: CreateTaskPayload) => {
    try {
      const createResponse = await axios.post<{ data: { id: number } }>(
        `${API_BASE_URL}/create`,
        payload
      );

      const taskId = createResponse.data.data.id;
      const taskResponse = await axios.get<{ data: Task }>(
        `${API_BASE_URL}/${taskId}`
      );

      toast.success("Задача успешно создана!");
      return taskResponse.data.data;
    } catch (error) {
      toast.error("Не удалось создать задачу.");
      throw error;
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ taskId, taskData }: UpdateTaskPayload) => {
    try {
      await axios.put(`${API_BASE_URL}/update/${taskId}`, taskData);
      const updatedTask = await axios.get<{ data: Task }>(
        `${API_BASE_URL}/${taskId}`
      );

      toast.success("Задача обновлена!");
      return updatedTask.data.data;
    } catch (error) {
      toast.error("Ошибка при обновлении задачи.");
      throw error;
    }
  }
);

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    resetCreateStatus: (state) => {
      state.createStatus = "idle";
    },
    resetUpdateStatus: (state) => {
      state.updateStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.fetchStatus = "loading";
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state) => {
        state.fetchStatus = "failed";
        state.error = "Не удалось загрузить задачи";
      })
      .addCase(createTask.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state) => {
        state.createStatus = "failed";
        state.error = "Не удалось создать задачу";
      })
      .addCase(updateTask.pending, (state) => {
        state.updateStatus = "loading";
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        state.tasks = state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        );
      })
      .addCase(updateTask.rejected, (state) => {
        state.updateStatus = "failed";
        state.error = "Не удалось обновить задачу";
      });
  },
});

export const { resetUpdateStatus, resetCreateStatus } = tasksSlice.actions;
export default tasksSlice.reducer;
