import React, { FC, useMemo, useState } from "react";
import "../styles/Game.css";
import { Button } from "antd";
import MineIcon from "../common/icons/MineIcon";
import FlagIcon from "../common/icons/FlagIcon";
import { FieldState } from "../types/Game";
import { useMineField } from "../hooks/useMineField";

interface MineCellProps {
  x: number;
  y: number;
  onExplore: (x: number, y: number) => void;
  onUpdateFlag: (x: number, y: number) => void;
  disabled?: boolean;
}

const MineCell: FC<MineCellProps> = ({
  x,
  y,
  onExplore,
  onUpdateFlag,
  disabled = false,
}) => {
  const {
    state: { fieldState, mineField },
  } = useMineField();
  const [isClickOpened, setIsClickOpened] = useState(false);

  const onFieldExplore = (e: React.MouseEvent) => {
    // Can't explore flagged or already opened field
    if (
      !fieldState ||
      fieldState[x][y] === FieldState.FLAGGED ||
      fieldState[x][y] === FieldState.OPENED
    ) {
      e.preventDefault();
      return;
    }

    // Explore minefield
    setIsClickOpened(true);
    onExplore(x, y);

    // Prevent default action
    e.preventDefault();
  };

  const onFieldFlag = (e: React.MouseEvent) => {
    // Can't flag already opened field
    if (!fieldState || fieldState[x][y] === FieldState.OPENED) {
      e.preventDefault();
      return;
    }

    // Update flag
    onUpdateFlag(x, y);

    // Prevent default action
    e.preventDefault();
  };

  const renderIcon = useMemo(() => {
    if (fieldState && fieldState[x][y] === FieldState.OPENED) {
      if (mineField && mineField[x][y] > 0) {
        return mineField[x][y];
      } else if (mineField && mineField[x][y] === 0) {
        return "";
      } else {
        return <MineIcon />;
      }
    } else if (fieldState && fieldState[x][y] === FieldState.FLAGGED) {
      return <FlagIcon />;
    } else {
      return "";
    }
  }, [fieldState, mineField, x, y]);

  return (
    <Button
      className={`mine-cell 
        ${fieldState && fieldState[x][y] === FieldState.OPENED && "opened"} 
        ${fieldState && fieldState[x][y] === FieldState.FLAGGED && "flagged"} 
        ${disabled && "disabled"} ${mineField && mineField[x][y] === -1 && "mine"} 
        ${isClickOpened && "click-opened"}`}
      icon={renderIcon}
      onClick={onFieldExplore}
      onContextMenu={onFieldFlag}
      disabled={disabled}
    />
  );
};

export default MineCell;
