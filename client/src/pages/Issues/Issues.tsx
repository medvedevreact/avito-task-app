import React, { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { TaskItem } from "../../components/TaskItem/TaskItem";
import { fetchTasks } from "../../store/taskSlice";
import { Select } from "../../components/Select/Select";
import { Modal } from "../../components/Modal/Modal";
import styles from "./Issues.module.scss";

const Issues: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { tasks, fetchStatus, error } = useAppSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (searchValue.trim()) {
      const searchLower = searchValue.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          task.assignee.email.toLowerCase().includes(searchLower) ||
          task.assignee.fullName.toLowerCase().includes(searchLower)
      );
    }

    if (filterValue !== "all") {
      if (["Low", "Medium", "High"].includes(filterValue)) {
        result = result.filter((task) => task.priority === filterValue);
      } else {
        result = result.filter((task) => task.boardName == filterValue);
      }
    }

    return result;
  }, [tasks, searchValue, filterValue]);

  if (fetchStatus === "loading") {
    return <div>Загрузка задач...</div>;
  }

  if (fetchStatus === "failed") {
    console.error("Tasks fetch error:", error);
    return <div>Ошибка загрузки задач.</div>;
  }

  return (
    <div className={styles.issues}>
      <div className={styles.controls}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Поиск задач..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Select value={filterValue} onChange={setFilterValue} />
      </div>

      {filteredTasks.length > 0 && (
        <ul className={styles.tasksList}>
          {filteredTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </ul>
      )}

      <button
        className={styles.createButton}
        onClick={() => setIsModalOpen(true)}
      >
        Создать задачу
      </button>

      {isModalOpen && <Modal setIsOpen={setIsModalOpen} />}
    </div>
  );
};

export default Issues;
