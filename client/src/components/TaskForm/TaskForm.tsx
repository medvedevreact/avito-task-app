import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "../../store";
import { getAllUsersForProject } from "../../helpers/form";
import { Assignee, Task, TaskPriority, TaskStatus } from "../../types";
import {
  updateTask,
  resetUpdateStatus,
  createTask,
  resetCreateStatus,
} from "../../store/taskSlice";
import { TaskFormData, taskSchema } from "../schema";
import styles from "./TaskForm.module.scss";

interface TaskFormProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  task?: Task;
  onTaskUpdated?: (updatedTask: Task) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  setIsOpen,
  task,
  onTaskUpdated,
}) => {
  const dispatch = useAppDispatch();
  const { boards } = useAppSelector((state) => state.boards);
  const { updateStatus, error } = useAppSelector((state) => state.tasks);
  const { createStatus } = useAppSelector((state) => state.tasks);
  const [users, setUsers] = useState<Assignee[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task
      ? {
          title: task.title,
          description: task.description,
          projectId: "",
          priority: task.priority as TaskPriority,
          status: task.status as TaskStatus,
          assigneeId: String(task.assignee.id),
        }
      : {
          title: "",
          description: "",
          projectId: "",
          priority: "" as TaskPriority,
          status: "" as TaskStatus,
          assigneeId: "",
        },
  });

  const selectedProject = watch("projectId");
  const selectedPriority = watch("priority");
  const selectedStatus = watch("status");
  const selectedAssignee = watch("assigneeId");

  useEffect(() => {
    return () => {
      dispatch(resetUpdateStatus());
      dispatch(resetCreateStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    if (boards.length > 0 && task?.boardName) {
      const foundBoard = boards.find((board) => board.name === task.boardName);
      if (foundBoard) {
        setValue("projectId", String(foundBoard.id));
      }
    }
  }, [boards, task?.boardName, setValue]);

  useEffect(() => {
    if (task) {
      setValue("assigneeId", String(task.assignee.id));
    }
  }, [task, setValue]);

  const onSubmit = async (data: TaskFormData) => {
    if (task) {
      await dispatch(
        updateTask({
          taskId: task.id,
          taskData: {
            title: data.title,
            description: data.description,
            priority: data.priority as TaskPriority,
            status: data.status as TaskStatus,
            assigneeId: Number(data.assigneeId),
          },
        })
      ).unwrap();

      if (onTaskUpdated) {
        onTaskUpdated({
          title: data.title,
          description: data.description,
          priority: data.priority as TaskPriority,
          status: data.status as TaskStatus,
          id: task.id,
          assignee:
            users.find((u) => u.id === Number(data.assigneeId)) ||
            task.assignee,
        });
      }
    } else {
      await dispatch(
        createTask({
          title: data.title,
          description: data.description,
          boardId: Number(data.projectId),
          priority: data.priority as TaskPriority,
          status: data.status as TaskStatus,
          assigneeId: Number(data.assigneeId),
        })
      ).unwrap();
    }

    reset();
    setIsOpen(false);
    dispatch(resetUpdateStatus());
    dispatch(resetCreateStatus());
  };

  useEffect(() => {
    if (selectedProject) {
      const loadUsers = async () => {
        try {
          const projectUsers = await getAllUsersForProject(
            Number(selectedProject)
          );
          setUsers(projectUsers);
        } catch (error) {
          console.error("Ошибка при загрузке пользователей:", error);
          setUsers([]);
        }
      };
      loadUsers();
    } else {
      setUsers([]);
    }
  }, [selectedProject]);

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h3 className={styles.formTitle}>
        {task ? "Редактирование задачи" : "Создание задачи"}
      </h3>

      {error && <p className={styles.errorMessage}>{error}</p>}

      <input
        type="text"
        placeholder="Название..."
        className={styles.formInput}
        {...register("title")}
      />
      {errors.title && (
        <p className={styles.errorMessage}>{errors.title.message}</p>
      )}

      <textarea
        placeholder="Описание..."
        className={styles.formTextarea}
        {...register("description")}
      />
      {errors.description && (
        <p className={styles.errorMessage}>{errors.description.message}</p>
      )}

      <select
        className={styles.select}
        {...register("projectId")}
        onChange={(e) => {
          setValue("projectId", e.target.value);
          setValue("priority", "");
          setValue("status", "");
          setValue("assigneeId", "");
        }}
      >
        <option value="">Выберите проект</option>
        {boards.map((board) => (
          <option key={board.id} value={board.id}>
            {board.name}
          </option>
        ))}
      </select>
      {errors.projectId && (
        <p className={styles.errorMessage}>{errors.projectId.message}</p>
      )}

      <select
        className={styles.select}
        {...register("priority")}
        onChange={(e) => {
          setValue("priority", e.target.value);
          setValue("status", "");
          setValue("assigneeId", "");
        }}
        disabled={!selectedProject}
      >
        <option value="">Выберите приоритет</option>
        <option value="Low">Низкий</option>
        <option value="Medium">Средний</option>
        <option value="High">Высокий</option>
      </select>
      {errors.priority && (
        <p className={styles.errorMessage}>{errors.priority.message}</p>
      )}

      <select
        className={styles.select}
        {...register("status")}
        onChange={(e) => {
          setValue("status", e.target.value);
          setValue("assigneeId", "");
        }}
        disabled={!selectedPriority}
      >
        <option value="">Выберите статус</option>
        <option value="Backlog">Бэклог</option>
        <option value="InProgress">В работе</option>
        <option value="Done">Завершено</option>
      </select>
      {errors.status && (
        <p className={styles.errorMessage}>{errors.status.message}</p>
      )}

      <select
        className={styles.select}
        {...register("assigneeId")}
        onChange={(e) => setValue("assigneeId", e.target.value)}
        disabled={!selectedStatus}
        value={selectedAssignee}
      >
        <option value="">Выберите исполнителя</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.fullName}
          </option>
        ))}
      </select>
      {errors.assigneeId && (
        <p className={styles.errorMessage}>{errors.assigneeId.message}</p>
      )}

      <button
        type="submit"
        className={styles.submitButton}
        disabled={
          updateStatus === "loading" ||
          createStatus === "loading" ||
          !selectedProject ||
          !selectedPriority ||
          !selectedStatus ||
          !selectedAssignee
        }
      >
        {updateStatus === "loading" || createStatus === "loading"
          ? "Сохранение..."
          : task
          ? "Сохранить изменения"
          : "Создать"}
      </button>
    </form>
  );
};
