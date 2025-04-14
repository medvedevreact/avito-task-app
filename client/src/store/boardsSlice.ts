import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

export type Board = {
  id: number;
  name: string;
  description: string;
  taskCount: number;
};

interface BoardsState {
  boards: Board[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: BoardsState = {
  boards: [],
  status: "idle",
  error: null,
};

const API_BASE_URL = "http://localhost:8080/api/v1/boards";

export const fetchBoards = createAsyncThunk("boards/fetchBoards", async () => {
  try {
    const response = await axios.get<{ data: Board[] }>(API_BASE_URL);
    return response.data.data;
  } catch (error) {
    toast.error("Не удалось загрузить доски.");
    throw error;
  }
});

const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.boards = action.payload;
      })
      .addCase(fetchBoards.rejected, (state) => {
        state.status = "failed";
        state.error = "Не удалось загрузить доски";
      });
  },
});

export default boardsSlice.reducer;
