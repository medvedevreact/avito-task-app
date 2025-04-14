export type Board = {
  id: number;
  name: string;
  description: string;
  taskCount: number;
};

export type Assignee = {
  id: number;
  fullName: string;
  email: string;
  avatarUrl: string;
  description?: string;
};

export type TaskStatus = "Backlog" | "InProgress" | "Done";
export type TaskPriority = "Low" | "Medium" | "High";

export type Task = {
  id: number;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  assigneeId?: number;
  assignee: Assignee;
  boardId?: number;
  boardName?: string;
};

export type TasksData = {
  data: Task[];
};
export type Team = {
  id: number;
  name: string;
  description: string;
  boardsCount?: number;
  usersCount?: number;
  boards?: {
    id: number;
    name: string;
    description: string;
  }[];
  users?: {
    id: number;
    fullName: string;
    email: string;
    avatarUrl: string;
    description?: string;
  }[];
};
