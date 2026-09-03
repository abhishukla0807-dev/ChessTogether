import { Game } from "@/types/game";

export const useGameDatabase = (_shouldFetchGames?: boolean) => {
  return {
    addGame: async (_game?: any) => 0,
    setGameEval: async (_gameId?: any, _evaluation?: any) => {},
    getGame: async (_gameId?: any) => undefined,
    deleteGame: async (_gameId?: any) => {},
    games: [] as Game[],
    isReady: true,
    gameFromUrl: undefined as Game | undefined,
  };
};
