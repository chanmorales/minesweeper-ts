import React, { createContext, FC, ReactNode, useReducer } from "react";

interface TimerState {
  elapsedSeconds: number;
  isActive: boolean;
}

const initialState: TimerState = {
  elapsedSeconds: 0,
  isActive: true,
};

type Action =
  | { type: "TOGGLE_TIMER" }
  | {
      type: "INCREMENT_ELAPSED_SECONDS";
      payload: number;
    }
  | { type: "RESET_TIMER" };

const reducer = (state: TimerState, action: Action) => {
  switch (action.type) {
    case "TOGGLE_TIMER":
      return { ...state, isActive: !state.isActive };
    case "INCREMENT_ELAPSED_SECONDS":
      return { ...state, elapsedSeconds: action.payload };
    case "RESET_TIMER":
      return { ...state, elapsedSeconds: 0 };
    default:
      return state;
  }
};

export const TimerContext = createContext<
  | {
      state: TimerState;
      timerDispatch: React.Dispatch<Action>;
    }
  | undefined
>(undefined);

export const TimerProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, timerDispatch] = useReducer(reducer, initialState);

  return (
    <TimerContext.Provider value={{ state, timerDispatch }}>
      {children}
    </TimerContext.Provider>
  );
};
