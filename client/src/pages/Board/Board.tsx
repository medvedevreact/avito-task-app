import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Task, TaskStatus } from "../../types";
import { TaskApi } from "../../api/tasks";

import styles from "./Board.module.scss";
import { Column } from "../../components/Column/Cloumn";

export interface BoardColumn {
  id: string;
  title: string;
  status: TaskStatus;
}
const Board: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const COLUMNS: BoardColumn[] = [
    { id: "Backlog", title: "Бэклог", status: "Backlog" },
    { id: "InProgress", title: "В процессе", status: "InProgress" },
    { id: "Done", title: "Завершено", status: "Done" },
  ];

  useEffect(() => {
    const loadTasks = async () => {
      if (!id) {
        setError("Не указан ID доски");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const boardTasks = await TaskApi.fetchBoardTasks(id);
        setTasks(boardTasks);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки задач.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [id]);

  const handleStatusUpdate = async (taskId: number, newStatus: TaskStatus) => {
    try {
      await TaskApi.updateTaskStatus(taskId, newStatus);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ошибка обновления статуса."
      );
    }
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;

    const taskId = Number(active.id);
    const newStatus = over.id as TaskStatus;

    await handleStatusUpdate(taskId, newStatus);
  };

  const updateLocalTask = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  if (isLoading) {
    return <div className={styles.loading}>Загрузка задач...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  return (
    <div className={styles.board}>
      <div className={styles.controls}>
        <h1>Доска задач: {id}</h1>
      </div>

      <div className={styles.boardColumns}>
        <DndContext onDragEnd={handleDragEnd}>
          {COLUMNS.map((column) => {
            const columnTasks = tasks.filter(
              (task) => task.status === column.status
            );
            return (
              <Column
                key={column.id}
                column={column}
                tasks={columnTasks}
                count={columnTasks.length}
                onTaskUpdated={updateLocalTask}
              />
            );
          })}
        </DndContext>
      </div>
    </div>
  );
};

export default Board;
