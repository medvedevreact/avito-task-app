import React from "react";
import { Board } from "../../types";
import styles from "./BoardItem.module.scss";
import { useNavigate } from "react-router-dom";

interface BoardItemProps {
  board: Board;
}

export const BoardItem: React.FC<BoardItemProps> = ({ board }) => {
  const navigate = useNavigate();
  return (
    <li className={styles.item}>
      <div className={styles.content}>
        <div>
          <h3 className={styles.title}>{board.name}</h3>
          <p className={styles.description}>{board.description}</p>
          <span className={styles.taskCount}>Задач: {board.taskCount}</span>
        </div>
        <button
          className={styles.button}
          onClick={() => {
            navigate(`/board/${board.id}`);
          }}
        >
          Перейти к проекту
        </button>
      </div>
    </li>
  );
};
