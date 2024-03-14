import { FC, useCallback, useEffect, useMemo, useState } from "react";
import MineCell from "./MineCell";
import MineHelper from "../utils/MineHelper";
import { FieldState } from "../types/Game";
import GameOverDialog from "./dialogs/GameOverDialog";
import { useMineField } from "../hooks/useMineField";
import GameDetails from "./GameDetails";
import Loading from "../common/animations/Loading";

interface MineFieldProps {
  width: number;
  height: number;
  bombs: number;
}

const MineField: FC<MineFieldProps> = ({ width, height, bombs }) => {
  const {
    state: { fieldState, mineField },
    dispatch,
  } = useMineField();

  const [isReady, setIsReady] = useState(false);
  const [isFieldGenerated, setIsFieldGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGameOver, setIsShowGameOver] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

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
    if (!fieldState) return;

    const updatedFieldState = [...fieldState];
    updatedFieldState.forEach((row, x) => {
      row.forEach((_, y) => {
        if (mineField && mineField[x][y] === -1) {
          updatedFieldState[x][y] = FieldState.OPENED;
        }
      });
    });
    dispatch({ type: "SET_FIELD_STATE", payload: updatedFieldState });
  }, [dispatch, fieldState, mineField]);

  const countOpen = useCallback(() => {
    if (fieldState) {
      return fieldState
        .flatMap((row) => row)
        .filter((e) => e === FieldState.OPENED).length;
    } else {
      return 0;
    }
  }, [fieldState]);

  const onExplore = useCallback(
    (row: number, col: number) => {
      if (!mineField || !fieldState) return;

      // Check if already game over
      if (isGameOver) {
        setIsShowGameOver(true);
        return;
      }

      // Generate minefield if not yet generated
      let updatedMineField;
      if (!isFieldGenerated) {
        setIsGenerating(true);
        updatedMineField = MineHelper.generateField(
          width,
          height,
          bombs,
          row,
          col
        );
        dispatch({ type: "SET_MINE_FIELD", payload: updatedMineField });
        setIsFieldGenerated(true);
      } else {
        updatedMineField = [...mineField];
      }

      if (updatedMineField[row][col] === -1) {
        // Game over when a mine is opened
        openAllMine();
        setIsGameOver(true);
        setIsShowGameOver(true);
      } else {
        // Explore mine and update the field state
        const updatedFieldState = [...fieldState];
        exploreMine(row, col, updatedFieldState, updatedMineField);
        dispatch({ type: "SET_FIELD_STATE", payload: updatedFieldState });

        // Game over when all non mine cell is explored
        const openedCellCount = countOpen();
        if (openedCellCount === width * height - bombs) {
          setIsGameOver(true);
          setIsShowGameOver(true);
        }
      }
    },
    [
      bombs,
      countOpen,
      dispatch,
      exploreMine,
      height,
      isFieldGenerated,
      isGameOver,
      openAllMine,
      fieldState,
      mineField,
      width,
    ]
  );

  const onUpdateFlag = useCallback(
    (row: number, col: number) => {
      if (!fieldState) return;

      const updatedFieldState = [...fieldState];
      updatedFieldState[row][col] === FieldState.FLAGGED
        ? dispatch({ type: "DECREMENT_FLAG_COUNT" })
        : dispatch({ type: "INCREMENT_FLAG_COUNT" });
      updatedFieldState[row][col] ^= 1;
      dispatch({ type: "SET_FIELD_STATE", payload: updatedFieldState });
    },
    [dispatch, fieldState]
  );

  const renderMineField = useMemo(() => {
    return (
      mineField &&
      fieldState &&
      mineField.map((row, i) => (
        <div key={i} className="mine-field-row flex">
          {row.map((_, j) => (
            <MineCell
              key={`${i}-${j}`}
              x={i}
              y={j}
              onExplore={onExplore}
              onUpdateFlag={onUpdateFlag}
              disabled={isGenerating}
            />
          ))}
        </div>
      ))
    );
  }, [isGenerating, onExplore, fieldState, mineField, onUpdateFlag]);

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

  return !isReady ? (
    <Loading />
  ) : (
    <div>
      <div className="game-details">
        <GameDetails bombs={99} />
      </div>
      <div className="mine-field">{<>{renderMineField}</>}</div>
      <GameOverDialog
        open={showGameOver}
        onCancel={() => setIsShowGameOver(false)}
      />
    </div>
  );
};

export default MineField;
