import axios from "axios";
import { Board, Team } from "../types";

export const getAllUsersForProject = async (projectId: number) => {
  try {
    // 1. Получаем все команды
    const teamsResponse = await axios.get("http://localhost:8080/api/v1/teams");
    const teams = teamsResponse.data.data;

    // 2. Параллельно запрашиваем детали каждой команды
    const teamDetailsPromises = teams.map((team: Team) =>
      axios.get(`http://localhost:8080/api/v1/teams/${team.id}`)
    );
    const teamDetailsResponses = await Promise.all(teamDetailsPromises);

    // 3. Оставляем только команды, где есть нужный projectId в boards
    const teamsWithProject = teamDetailsResponses
      .map((response) => response.data.data)
      .filter((team) =>
        team.boards.some((board: Board) => board.id === projectId)
      );

    // 4. Собираем всех пользователей из этих команд
    const allUsers = teamsWithProject.flatMap((team) => team.users);
    console.log(allUsers);
    return allUsers;
  } catch (error) {
    console.error("Error fetching users for project:", error);
    return []; // Возвращаем пустой массив при ошибке
  }
};
