import React, { useState } from "react";
import { Task } from "../../types";
import { useDraggable } from "@dnd-kit/core";
import { EditModal } from "../EditModal/EditModal";
import { BsGripVertical } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../store";
import styles from "./DraggableTaskItem.module.scss";

interface DraggableTaskItemProps {
  task: Task;
  onTaskUpdated: (updatedTask: Task) => void;
}

const PRIORITY_LABELS = {
  High: "Высокий",
  Medium: "Средний",
  Low: "Низкий",
};

export const DraggableTaskItem: React.FC<DraggableTaskItemProps> = ({
  task,
  onTaskUpdated,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { boards } = useAppSelector((state) => state.boards);
  const { id } = useParams();

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const boardName = boards.find((board) => board.id.toString() === id)?.name;
  const updatedTask = { ...task, boardName };

  const style: React.CSSProperties | undefined = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 1000,
        position: "relative",
      }
    : undefined;

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

  return (
    <>
      <li ref={setNodeRef} className={styles.taskItem} style={style}>
        <div className={styles.taskHeader}>
          <h3
            className={styles.taskTitle}
            onClick={() => setIsEditModalOpen(true)}
          >
            {task.title}
          </h3>
          <div
            className={styles.dragHandle}
            {...listeners}
            {...attributes}
            aria-label="Перетащить задачу"
          >
            <BsGripVertical size={18} />
          </div>
        </div>

        <div className={styles.taskContent}>
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
              className={`${styles.taskPriority} ${getPriorityClass(
                task.priority as keyof typeof PRIORITY_LABELS
              )}`}
            >
              {PRIORITY_LABELS[task.priority as keyof typeof PRIORITY_LABELS]}
            </span>
          </div>
        </div>
      </li>

      {isEditModalOpen && (
        <EditModal
          setIsOpen={setIsEditModalOpen}
          task={updatedTask as Task}
          onTaskUpdated={onTaskUpdated}
        />
      )}
    </>
  );
};
