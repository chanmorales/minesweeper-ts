interface GameType {
  width: number;
  height: number;
  bombs: number;
}

const EASY: GameType = { width: 9, height: 9, bombs: 10 };
const INTERMEDIATE: GameType = { width: 16, height: 16, bombs: 40 };
const ADVANCED: GameType = { width: 30, height: 16, bombs: 99 };

export type GAME_TYPES = typeof EASY | typeof INTERMEDIATE | typeof ADVANCED;

export interface Coordinates {
  x: number;
  y: number;
}