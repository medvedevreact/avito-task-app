import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { Board } from "../../types";
import { fetchBoards } from "../../store/boardsSlice";
import styles from "./Select.module.scss";

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const Select: React.FC<SelectProps> = ({ value, onChange }) => {
  const { boards } = useAppSelector((state) => state.boards);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <select onChange={handleChange} className={styles.select} value={value}>
      <option value="all">Все задачи</option>
      <option value="Low">Низкий приоритет</option>
      <option value="Medium">Средний приоритет</option>
      <option value="High">Высокий приоритет</option>
      {boards.length > 0 &&
        boards.map((board: Board) => (
          <option key={board.id} value={`${board.name}`}>
            {board.name}
          </option>
        ))}
    </select>
  );
};
