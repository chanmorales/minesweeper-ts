import { FC, useCallback, useEffect, useState } from "react";
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
  const [showGameOver, setShowGameOver] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const exploreNeighbor = useCallback(
    (
      row: number,
      col: number,
      fieldState: FieldState[][],
      mineField: number[][],
      exploreMine: (
        row: number,
        col: number,
        fieldState: FieldState[][],
        mineField: number[][]
      ) => void
    ) => {
      // Explore left
      exploreMine(row, col - 1, fieldState, mineField);
      // Explore upper-left
      exploreMine(row - 1, col - 1, fieldState, mineField);
      // Explore lower-left
      exploreMine(row + 1, col - 1, fieldState, mineField);
      // Explore right
      exploreMine(row, col + 1, fieldState, mineField);
      // Explore upper-right
      exploreMine(row - 1, col + 1, fieldState, mineField);
      // Explore lower-right
      exploreMine(row + 1, col + 1, fieldState, mineField);
      // Explore up
      exploreMine(row - 1, col, fieldState, mineField);
      // Explore down
      exploreMine(row + 1, col, fieldState, mineField);
    },
    []
  );

  const exploreMine = useCallback(
    (
      row: number,
      col: number,
      fieldState: FieldState[][],
      mineField: number[][]
    ) => {
      // Do not open when not unexplored
      if (
        row < 0 ||
        col < 0 ||
        row >= height ||
        col >= width ||
        fieldState[row][col] !== FieldState.UNEXPLORED
      ) {
        return;
      }

      // Open current cell and if mine count is 0, open neighbors as well
      fieldState[row][col] = FieldState.OPENED;
      if (mineField[row][col] === 0) {
        exploreNeighbor(row, col, fieldState, mineField, exploreMine);
      }
    },
    [exploreNeighbor, height, width]
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

  const countNeighborFlag = useCallback(
    (row: number, col: number) => {
      if (!fieldState) return 0;

      const offsets = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ];

      let flagCount = 0;
      for (const offset of offsets) {
        const newRow = row + offset[0];
        const newCol = col + offset[1];

        if (
          newRow >= 0 &&
          newRow < height &&
          newCol >= 0 &&
          newCol < width &&
          fieldState[newRow][newCol] === FieldState.FLAGGED
        ) {
          flagCount++;
        }
      }

      return flagCount;
    },
    [fieldState, height, width]
  );

  const checkGameOver = useCallback(() => {
    // Game over when all non mine cell is explored
    const openedCellCount = countOpen();
    if (openedCellCount === width * height - bombs) {
      setIsGameOver(true);
      setShowGameOver(true);
    }
  }, [bombs, countOpen, height, width]);

  const onExploreNeighbor = useCallback(
    (row: number, col: number) => {
      if (!fieldState || !mineField) return;

      // Explore neighbor only if flag count is equal to bomb count
      const flagCount = countNeighborFlag(row, col);
      if (flagCount === mineField[row][col]) {
        const updatedFieldState = [...fieldState];

        exploreNeighbor(row, col, updatedFieldState, mineField, (r, c, f, m) =>
          exploreMine(r, c, f, m)
        );
        dispatch({ type: "SET_FIELD_STATE", payload: updatedFieldState });

        // Check for game over
        checkGameOver();
      }
    },
    [
      checkGameOver,
      countNeighborFlag,
      dispatch,
      exploreMine,
      exploreNeighbor,
      fieldState,
      mineField,
    ]
  );

  const onExplore = useCallback(
    (row: number, col: number) => {
      if (!mineField || !fieldState) return;

      // Check if already game over
      if (isGameOver) {
        setShowGameOver(true);
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
        setShowGameOver(true);
      } else {
        // Explore mine and update the field state
        const updatedFieldState = [...fieldState];
        exploreMine(row, col, updatedFieldState, updatedMineField);
        dispatch({ type: "SET_FIELD_STATE", payload: updatedFieldState });

        // Check for game over
        checkGameOver();
      }
    },
    [
      bombs,
      checkGameOver,
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
      <div className="mine-field">
        {
          <>
            {mineField &&
              fieldState &&
              mineField.map((row, i) => (
                <div key={`row-${i}`} className="mine-field-row flex">
                  {row.map((_, j) => (
                    <MineCell
                      key={`mine-cell-${i}-${j}`}
                      x={i}
                      y={j}
                      onExplore={onExplore}
                      onExploreNeighbor={onExploreNeighbor}
                      onUpdateFlag={onUpdateFlag}
                      disabled={isGenerating}
                    />
                  ))}
                </div>
              ))}
          </>
        }
      </div>
      <GameOverDialog
        open={showGameOver}
        onCancel={() => setShowGameOver(false)}
      />
    </div>
  );
};

export default MineField;
