import { Navigate } from "react-router-dom";
import { lazy } from "react";

const Boards = lazy(() => import("./pages/Boards/Boards"));
const Issues = lazy(() => import("./pages/Issues/Issues"));
const Board = lazy(() => import("./pages/Board/Board"));

export const routes = [
  { path: "/", element: <Navigate to="/issues" replace /> },
  { path: "/boards", element: <Boards /> },
  { path: "/issues", element: <Issues /> },
  { path: "/board/:id", element: <Board /> },
];
