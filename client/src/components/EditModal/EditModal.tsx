import React from "react";
import { Task } from "../../types";
import { TaskForm } from "../TaskForm/TaskForm";
import styles from "./EditModal.module.scss";

interface EditModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  task: Task;
  onTaskUpdated?: (updatedTask: Task) => void;
}

export const EditModal: React.FC<EditModalProps> = ({
  setIsOpen,
  task,
  onTaskUpdated,
}) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
          &times;
        </button>
        <TaskForm
          setIsOpen={setIsOpen}
          task={task}
          onTaskUpdated={onTaskUpdated}
        />
      </div>
    </div>
  );
};
