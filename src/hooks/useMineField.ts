import { useContext } from "react";
import { MineFieldContext } from "../store/MineFieldStore";

export const useMineField = () => {
  const context = useContext(MineFieldContext);
  if (!context) {
    throw new Error("useMineField must be used within a MineFieldProvider");
  }

  return context;
};