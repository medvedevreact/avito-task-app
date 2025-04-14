import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchBoards } from "../../store/boardsSlice";
import { BoardItem } from "../../components/BoardItem/BoardItem";
import styles from "./Boards.module.scss";

const Boards: React.FC = () => {
  const dispatch = useAppDispatch();
  const { boards, status, error } = useAppSelector((state) => state.boards);

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  if (status === "loading") {
    return <div>Загрузка досок...</div>;
  }

  if (status === "failed") {
    console.error("Boards fetch error:", error);
    return <div>Ошибка загрузки данных.</div>;
  }

  return (
    <div className={styles.boards}>
      {boards.length > 0 && (
        <ul>
          {boards.map((board) => (
            <BoardItem key={board.id} board={board} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Boards;
