import React from "react";
import { TaskForm } from "../TaskForm/TaskForm";
import styles from "./Modal.module.scss";

interface ModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Modal: React.FC<ModalProps> = ({ setIsOpen }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
          &times;
        </button>
        <TaskForm setIsOpen={setIsOpen} />
      </div>
    </div>
  );
};
