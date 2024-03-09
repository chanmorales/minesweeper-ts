import { FieldState } from "../types/Game";
import React, { createContext, FC, ReactNode, useReducer } from "react";

interface MineFieldState {
  mineField: number[][] | null;
  fieldState: FieldState[][] | null;
}

const initialState: MineFieldState = {
  mineField: null,
  fieldState: null,
};

type Action =
  | { type: "SET_MINE_FIELD"; payload: number[][] }
  | { type: "SET_FIELD_STATE"; payload: FieldState[][] };

const reducer = (state: MineFieldState, action: Action) => {
  switch (action.type) {
    case "SET_MINE_FIELD":
      return { ...state, mineField: action.payload };
    case "SET_FIELD_STATE":
      return { ...state, fieldState: action.payload };
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