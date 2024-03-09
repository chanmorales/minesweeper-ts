import { FC, useCallback, useEffect, useMemo, useState } from "react";
import MineCell from "./MineCell";
import MineHelper from "../utils/MineHelper";
import { FieldState } from "../types/Game";
import GameOverDialog from "./dialogs/GameOverDialog";
import { useMineField } from "../hooks/useMineField";

interface MineFieldProps {
  width: number;
  height: number;
  bombs: number;
}

const MineField: FC<MineFieldProps> = ({ width, height, bombs }) => {
  const { state, dispatch } = useMineField();

  const [isReady, setIsReady] = useState(false);
  const [isFieldGenerated, setIsFieldGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGameOver, setIsShowGameOver] = useState(false);

  const exploreMine = useCallback(
    (
      row: number,
      col: number,
      fieldState: FieldState[][],
      mineField: number[][]
    ) => {
      // Do not open when not unexplored
      if (fieldState[row][col] !== FieldState.UNEXPLORED) return;

      // Open current cell and if mine count is 0, open neighbors as well
      fieldState[row][col] = FieldState.OPENED;
      if (mineField[row][col] === 0) {
        if (col > 0) {
          // Explore left
          exploreMine(row, col - 1, fieldState, mineField);
          // Explore upper-left
          if (row > 0) exploreMine(row - 1, col - 1, fieldState, mineField);
          // Explore lower-left
          if (row < height - 1)
            exploreMine(row + 1, col - 1, fieldState, mineField);
        }

        if (col < width - 1) {
          // Explore right
          exploreMine(row, col + 1, fieldState, mineField);
          // Explore upper-right
          if (row > 0) exploreMine(row - 1, col + 1, fieldState, mineField);
          // Explore lower-right
          if (row < height - 1)
            exploreMine(row + 1, col + 1, fieldState, mineField);
        }

        // Explore up
        if (row > 0) exploreMine(row - 1, col, fieldState, mineField);

        // Explore down
        if (row < height - 1) exploreMine(row + 1, col, fieldState, mineField);
      }
    },
    [height, width]
  );

  const openAllMine = useCallback(() => {
    if (!state.fieldState) return;

    const updatedFieldState = [...state.fieldState];
    updatedFieldState.forEach((row, x) => {
      row.forEach((cell, y) => {
        if (state.mineField && state.mineField[x][y] === -1) {
          updatedFieldState[x][y] = FieldState.OPENED;
        }
      });
    });
    dispatch({ type: "SET_FIELD_STATE", payload: updatedFieldState });
  }, [dispatch, state.fieldState, state.mineField]);

  const onExplore = useCallback(
    (row: number, col: number) => {
      if (!state.mineField || !state.fieldState) return;

      // Generate minefield if not yet generated
      let mineField;
      if (!isFieldGenerated) {
        setIsGenerating(true);
        mineField = MineHelper.generateField(width, height, bombs, row, col);
        dispatch({ type: "SET_MINE_FIELD", payload: mineField });
        setIsFieldGenerated(true);
      } else {
        mineField = [...state.mineField];
      }

      if (mineField[row][col] === -1) {
        // Game over when a mine is opened
        openAllMine();
        setIsShowGameOver(true);
      } else {
        // Explore mine and update the field state
        const updatedFieldState = [...state.fieldState];
        exploreMine(row, col, updatedFieldState, mineField);
        dispatch({ type: "SET_FIELD_STATE", payload: updatedFieldState });
      }
    },
    [
      bombs,
      dispatch,
      height,
      isFieldGenerated,
      state.fieldState,
      state.mineField,
      exploreMine,
      width,
      openAllMine,
    ]
  );

  const onUpdateFlag = useCallback(
    (row: number, col: number) => {
      if (!state.fieldState) return;

      const updatedFieldState = [...state.fieldState];
      updatedFieldState[row][col] ^= 1;
      dispatch({ type: "SET_FIELD_STATE", payload: updatedFieldState });
    },
    [dispatch, state.fieldState]
  );

  const renderMineField = useMemo(() => {
    return (
      state.mineField &&
      state.fieldState &&
      state.mineField.map((row, i) => (
        <div key={i} className="mine-field-row flex">
          {row.map((field, j) => (
            <MineCell
              key={`${i}-${j}`}
              x={i}
              y={j}
              bombs={state.mineField?.[i][j] ?? 0}
              fieldState={state.fieldState?.[i][j] ?? FieldState.UNEXPLORED}
              onExplore={onExplore}
              onUpdateFlag={onUpdateFlag}
              disabled={isGenerating}
            />
          ))}
        </div>
      ))
    );
  }, [
    isGenerating,
    onExplore,
    state.fieldState,
    state.mineField,
    onUpdateFlag,
  ]);

  useEffect(() => {
    // Initialize minefield to all zero's and field state to all unexplored
    const mineField = [];
    const fieldState = [];
    for (let i = 0; i < height; i++) {
      mineField.push(new Array(width).fill(0));
      fieldState.push(new Array(width).fill(FieldState.UNEXPLORED));
    }

    dispatch({ type: "SET_MINE_FIELD", payload: mineField });
    dispatch({ type: "SET_FIELD_STATE", payload: fieldState });
    setIsReady(true);
  }, [dispatch, height, width]);

  useEffect(() => {
    if (isFieldGenerated) {
      setIsGenerating(false);
    }
  }, [isFieldGenerated]);

  return (
    <>
      <div className="mine-field">{isReady && <>{renderMineField}</>}</div>
      <GameOverDialog
        open={showGameOver}
        onCancel={() => setIsShowGameOver(false)}
      />
    </>
  );
};

export default MineField;