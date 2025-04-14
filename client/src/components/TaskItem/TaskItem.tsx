import React, { useState } from "react";
import { Task } from "../../types";
import { EditModal } from "../EditModal/EditModal";
import styles from "./TaskItem.module.scss";

interface TaskItemProps {
  task: Task;
}

const PRIORITY_LABELS = {
  High: "Высокий",
  Medium: "Средний",
  Low: "Низкий",
};

const STATUS_LABELS = {
  Done: "Завершено",
  InProgress: "В процессе",
  Backlog: "Бэклог",
};

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const getPriorityClass = (priority: keyof typeof PRIORITY_LABELS) => {
    switch (priority) {
      case "High":
        return styles.priorityHigh;
      case "Medium":
        return styles.priorityMedium;
      default:
        return styles.priorityLow;
    }
  };

  const getStatusClass = (status: keyof typeof STATUS_LABELS) => {
    switch (status) {
      case "Done":
        return styles.statusDone;
      case "InProgress":
        return styles.statusInProgress;
      default:
        return styles.statusBacklog;
    }
  };

  return (
    <>
      <li className={styles.taskItem}>
        <div className={styles.taskHeader}>
          <h3
            className={styles.taskTitle}
            onClick={() => setIsEditModalOpen(true)}
            style={{ cursor: "pointer" }}
          >
            {task.title}
          </h3>
          <span
            className={`${styles.taskPriority} ${getPriorityClass(
              task.priority as keyof typeof PRIORITY_LABELS
            )}`}
          >
            {PRIORITY_LABELS[task.priority as keyof typeof PRIORITY_LABELS]}
          </span>
        </div>

        <p className={styles.taskDescription}>{task.description}</p>

        <div className={styles.taskFooter}>
          <div className={styles.assigneeInfo}>
            <img
              src={task.assignee.avatarUrl}
              alt={task.assignee.fullName}
              className={styles.assigneeAvatar}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "https://avatars.mds.yandex.net/i?id=5a3ffdd177450896ae0bdf659cf1c9e4_l-7745047-images-thumbs&n=13";
              }}
            />
            <span className={styles.assigneeName}>
              {task.assignee.fullName}
            </span>
          </div>

          <span
            className={`${styles.taskStatus} ${getStatusClass(
              task.status as keyof typeof STATUS_LABELS
            )}`}
          >
            {STATUS_LABELS[task.status as keyof typeof STATUS_LABELS]}
          </span>
        </div>
      </li>

      {isEditModalOpen && (
        <EditModal setIsOpen={setIsEditModalOpen} task={task} />
      )}
    </>
  );
};
