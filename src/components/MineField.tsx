import { FC, useCallback, useEffect, useMemo, useState } from "react";
import MineCell from "./MineCell";
import MineHelper from "../utils/MineHelper";
import { FieldState } from "../types/Game";
import GameOverDialog from "./dialogs/GameOverDialog";

interface MineFieldProps {
  width: number;
  height: number;
  bombs: number;
}

const MineField: FC<MineFieldProps> = ({ width, height, bombs }) => {
  const [isReady, setIsReady] = useState(false);
  const [isFieldGenerated, setIsFieldGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mineField, setMineField] = useState<number[][] | null>(null);
  const [fieldState, setFieldState] = useState<FieldState[][] | null>(null);
  const [showGameOver, setIsShowGameOver] = useState(false);

  // TODO Improvement: use reducer
  const updateFieldState = useCallback(
    (x: number, y: number, fieldState: FieldState) => {
      setFieldState((prevState) => {
        if (prevState) {
          const newFieldState = [...prevState];
          newFieldState[x] = [...prevState[x]];
          newFieldState[x][y] = fieldState;
          return newFieldState;
        } else {
          return prevState;
        }
      });
    },
    []
  );

  const onExplore = useCallback(
    (x: number, y: number) => {
      if (!mineField || !fieldState) return;

      // Generate minefield if not yet generated
      if (!isFieldGenerated) {
        setIsGenerating(true);
        const mineField = MineHelper.generateField(width, height, bombs, x, y);
        setMineField(mineField);
        setIsFieldGenerated(true);
      }

      // Set field state to opened
      updateFieldState(x, y, FieldState.OPENED);

      // Game over when a mine is opened
      if (mineField[x][y] === -1) {
        setIsShowGameOver(true);
      }
    },
    [
      bombs,
      fieldState,
      height,
      isFieldGenerated,
      mineField,
      updateFieldState,
      width,
    ]
  );

  const onUpdateFlag = useCallback(
    (x: number, y: number) => {
      if (!fieldState) return;

      // Flag field or remove flag depending on state
      if (fieldState[x][y] === FieldState.FLAGGED) {
        updateFieldState(x, y, FieldState.UNEXPLORED);
      } else if (fieldState[x][y] === FieldState.UNEXPLORED) {
        updateFieldState(x, y, FieldState.FLAGGED);
      }
    },
    [fieldState, updateFieldState]
  );

  const renderMineField = useMemo(() => {
    if (!mineField || !fieldState) return <></>;
    return mineField?.map((row, i) => (
      <div key={i} className="mine-field-row flex">
        {row.map((field, j) => (
          <MineCell
            key={`${i}-${j}`}
            x={i}
            y={j}
            bombs={mineField[i][j]}
            fieldState={fieldState[i][j]}
            onExplore={onExplore}
            onUpdateFlag={onUpdateFlag}
            disabled={isGenerating}
          />
        ))}
      </div>
    ));
  }, [fieldState, isGenerating, mineField, onExplore, onUpdateFlag]);

  useEffect(() => {
    // Initialize minefield to all zero's and field state to all unexplored
    const mineField = [];
    const fieldState = [];
    for (let i = 0; i < height; i++) {
      mineField.push(new Array(width).fill(0));
      fieldState.push(new Array(width).fill(FieldState.UNEXPLORED));
    }

    setMineField(mineField);
    setFieldState(fieldState);
    setIsReady(true);
  }, [height, width]);

  useEffect(() => {
    if (isFieldGenerated) {
      setIsGenerating(false);
    }
  }, [isFieldGenerated]);

  return (
    <>
      <div className="mine-field">{isReady && <>{renderMineField}</>}</div>
      <GameOverDialog open={showGameOver} />
    </>
  );
};

export default MineField;