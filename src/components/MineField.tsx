import { useCallback, useEffect, useState } from "react";
import MineCell from "./MineCell";
import MineHelper from "../utils/MineHelper";
import { FieldState } from "../types/Game";
import GameOverDialog from "./dialogs/GameOverDialog";
import { useMineField } from "../hooks/useMineField";
import GameDetails from "./GameDetails";
import Loading from "../common/animations/Loading";
import SelectGameDifficultyDialog from "./dialogs/SelectGameDifficultyDialog";
import { useTimer } from "../hooks/useTimer";

const MineField = () => {
  const {
    state: { fieldState, mineField, difficulty },
    dispatch,
  } = useMineField();

  const { timerDispatch } = useTimer();

  const [isReady, setIsReady] = useState(false);
  const [isFieldGenerated, setIsFieldGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isExploded, setIsExploded] = useState(false);
  const [isDifficultySelectOpen, setIsDifficultySelectOpen] = useState(false);

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
        !difficulty ||
        row < 0 ||
        col < 0 ||
        row >= difficulty.height ||
        col >= difficulty.width ||
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
    [difficulty, exploreNeighbor]
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
      if (!fieldState || !difficulty) return 0;

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
          newRow < difficulty.height &&
          newCol >= 0 &&
          newCol < difficulty.width &&
          fieldState[newRow][newCol] === FieldState.FLAGGED
        ) {
          flagCount++;
        }
      }

      return flagCount;
    },
    [difficulty, fieldState]
  );

  const checkGameOver = useCallback(() => {
    if (!difficulty) return;

    // Game over when all non mine cell is explored
    const openedCellCount = countOpen();
    if (
      openedCellCount ===
      difficulty.width * difficulty.height - difficulty.bombs
    ) {
      setIsExploded(false);
      setIsGameOver(true);
      setShowGameOver(true);
    }
  }, [countOpen, difficulty]);

  const gameOver = useCallback(() => {
    openAllMine();
    setIsExploded(true);
    setIsGameOver(true);
    setShowGameOver(true);
  }, [openAllMine]);

  const checkMineNeighbor = useCallback(
    (row: number, col: number) => {
      if (
        !difficulty ||
        !mineField ||
        !fieldState ||
        row < 0 ||
        col < 0 ||
        row >= difficulty.height ||
        col >= difficulty.width
      )
        return;

      if (
        fieldState[row][col] !== FieldState.FLAGGED &&
        mineField[row][col] === -1
      ) {
        gameOver();
      }
    },
    [difficulty, fieldState, gameOver, mineField]
  );

  const onExploreNeighbor = useCallback(
    (row: number, col: number) => {
      if (!fieldState || !mineField) return;

      // Explore neighbor only if flag count is equal to bomb count
      const flagCount = countNeighborFlag(row, col);
      if (flagCount === mineField[row][col]) {
        const updatedFieldState = [...fieldState];

        checkMineNeighbor(row - 1, col);
        checkMineNeighbor(row - 1, col - 1);
        checkMineNeighbor(row - 1, col + 1);
        checkMineNeighbor(row, col - 1);
        checkMineNeighbor(row, col + 1);
        checkMineNeighbor(row + 1, col);
        checkMineNeighbor(row + 1, col - 1);
        checkMineNeighbor(row + 1, col + 1);

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
      checkMineNeighbor,
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
      if (!mineField || !fieldState || !difficulty) return;

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
          difficulty.width,
          difficulty.height,
          difficulty.bombs,
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
        gameOver();
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
      checkGameOver,
      difficulty,
      dispatch,
      exploreMine,
      gameOver,
      isFieldGenerated,
      isGameOver,
      fieldState,
      mineField,
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

  const onNewGame = useCallback(() => {
    dispatch({ type: "NEW_GAME" });
    timerDispatch({ type: "RESET_TIMER" });
    setIsReady(false);
    setIsFieldGenerated(false);
    setIsGenerating(false);
    setShowGameOver(false);
    setIsGameOver(false);
    setIsExploded(false);
    setIsDifficultySelectOpen(false);
  }, [dispatch, timerDispatch]);

  useEffect(() => {
    if (!difficulty) {
      setIsDifficultySelectOpen(true);
    } else {
      setIsDifficultySelectOpen(false);
    }
  }, [difficulty]);

  useEffect(() => {
    if (!difficulty) return;

    // Initialize minefield to all zero's and field state to all unexplored
    const mineField = [];
    const fieldState = [];
    for (let i = 0; i < difficulty.height; i++) {
      mineField.push(new Array(difficulty.width).fill(0));
      fieldState.push(new Array(difficulty.width).fill(FieldState.UNEXPLORED));
    }

    dispatch({ type: "SET_MINE_FIELD", payload: mineField });
    dispatch({ type: "SET_FIELD_STATE", payload: fieldState });
    setIsReady(true);
  }, [difficulty, dispatch]);

  useEffect(() => {
    if (isFieldGenerated) {
      setIsGenerating(false);
    }
  }, [isFieldGenerated]);

  return (
    <div>
      {!isReady ? (
        <Loading />
      ) : (
        <>
          <div className="game-details">
            <GameDetails />
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
        </>
      )}
      <SelectGameDifficultyDialog
        onDifficultySelect={(difficulty) => {
          dispatch({
            type: "SET_DIFFICULTY",
            payload: difficulty,
          });
        }}
        open={isDifficultySelectOpen}
      />
      <GameOverDialog
        open={showGameOver}
        closable={false}
        keyboard={false}
        isExploded={isExploded}
        onNewGame={onNewGame}
      />
    </div>
  );
};

export default MineField;
