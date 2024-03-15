export type GameDifficulty = {
  label: string;
  height: number;
  width: number;
  bombs: number;
};

export const Easy: GameDifficulty = {
  label: "Easy",
  width: 9,
  height: 9,
  bombs: 10,
};

export const Intermediate: GameDifficulty = {
  label: "Intermediate",
  width: 16,
  height: 16,
  bombs: 40,
};

export const Advanced: GameDifficulty = {
  label: "Advanced",
  width: 30,
  height: 16,
  bombs: 99,
};
