import { FieldState } from "../types/Game";
import React, { createContext, FC, ReactNode, useReducer } from "react";
import { GameDifficulty } from "../types/GameDifficulty";

interface MineFieldState {
  mineField: number[][] | null;
  fieldState: FieldState[][] | null;
  flagCount: number;
  difficulty: GameDifficulty | null;
}

const initialState: MineFieldState = {
  mineField: null,
  fieldState: null,
  flagCount: 0,
  difficulty: null,
};

type Action =
  | { type: "SET_MINE_FIELD"; payload: number[][] }
  | { type: "SET_FIELD_STATE"; payload: FieldState[][] }
  | { type: "INCREMENT_FLAG_COUNT" }
  | { type: "DECREMENT_FLAG_COUNT" }
  | { type: "SET_DIFFICULTY"; payload: GameDifficulty }
  | { type: "NEW_GAME" };

const reducer = (state: MineFieldState, action: Action) => {
  switch (action.type) {
    case "SET_MINE_FIELD":
      return { ...state, mineField: action.payload };
    case "SET_FIELD_STATE":
      return { ...state, fieldState: action.payload };
    case "INCREMENT_FLAG_COUNT":
      return { ...state, flagCount: state.flagCount + 1 };
    case "DECREMENT_FLAG_COUNT":
      return { ...state, flagCount: state.flagCount - 1 };
    case "SET_DIFFICULTY":
      return { ...state, difficulty: action.payload };
    case "NEW_GAME":
      return initialState;
    default:
      return state;
  }
};

export const MineFieldContext = createContext<
  | {
      state: MineFieldState;
      dispatch: React.Dispatch<Action>;
    }
  | undefined
>(undefined);

export const MineFieldProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <MineFieldContext.Provider value={{ state, dispatch }}>
      {children}
    </MineFieldContext.Provider>
  );
};
