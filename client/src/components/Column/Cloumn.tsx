import React from "react";
import { DraggableTaskItem } from "../DraggableTaskItem/DraggableTaskItem";
import { Task } from "../../types";
import { useDroppable } from "@dnd-kit/core";
import { BoardColumn } from "../../pages/Board/Board";
import styles from "./Column.module.scss";

interface ColumnProps {
  column: BoardColumn;
  tasks: Task[];
  count: number;
  onTaskUpdated: (task: Task) => void;
}

export const Column: React.FC<ColumnProps> = ({
  column,
  tasks,
  count,
  onTaskUpdated,
}) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });
  return (
    <div ref={setNodeRef} className={styles.column}>
      <h2 className={styles.columnTitle}>
        {column.title} <span className={styles.taskCount}>{count}</span>
      </h2>
      <ul className={styles.tasksList}>
        {tasks.map((task) => (
          <DraggableTaskItem
            key={task.id}
            task={task}
            onTaskUpdated={onTaskUpdated}
          />
        ))}
      </ul>
    </div>
  );
};
