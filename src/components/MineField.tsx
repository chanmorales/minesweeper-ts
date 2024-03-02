import { FC, useCallback, useEffect, useMemo, useState } from "react";
import MineCell from "./MineCell";
import MineHelper from "../utils/MineHelper";

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

  const onOpen = useCallback(
    (x: number, y: number) => {
      if (isFieldGenerated) return;

      setIsGenerating(true);
      const mineField = MineHelper.generateField(width, height, bombs, x, y);
      setMineField(mineField);
      setIsFieldGenerated(true);
    },
    [bombs, height, width, isFieldGenerated]
  );

  const renderMineField = useMemo(() => {
    if (!mineField) return <></>;
    return mineField?.map((row, i) => (
      <div key={i} className="mine-field-row flex">
        {row.map((field, j) => (
          <MineCell
            key={`${i}-${j}`}
            x={i}
            y={j}
            bombs={mineField[i][j]}
            onOpen={onOpen}
            disabled={isGenerating}
          />
        ))}
      </div>
    ));
  }, [mineField, isGenerating, onOpen]);

  useEffect(() => {
    // Set minefield initially to all zero's
    let mineField = [];
    for (let i = 0; i < height; i++) {
      mineField.push(new Array(width).fill(0));
    }
    setMineField(mineField);
    setIsReady(true);
  }, [height, width]);

  useEffect(() => {
    if (isFieldGenerated) {
      setIsGenerating(false);
    }
  }, [isFieldGenerated]);

  return <div className="mine-field">{isReady && <>{renderMineField}</>}</div>;
};

export default MineField;