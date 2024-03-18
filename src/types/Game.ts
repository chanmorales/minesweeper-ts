export interface Coordinates {
  row: number;
  col: number;
}

export enum FieldState {
  UNEXPLORED,
  FLAGGED,
  OPENED,
}
