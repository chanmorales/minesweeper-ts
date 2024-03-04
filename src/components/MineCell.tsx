import React, { FC, useEffect, useMemo } from "react";
import "../styles/Game.css";
import { Button } from "antd";
import MineIcon from "../common/icons/MineIcon";
import FlagIcon from "../common/icons/FlagIcon";
import { FieldState } from "../types/Game";

interface MineCellProps {
  x: number;
  y: number;
  bombs: number;
  fieldState: FieldState;
  onExplore: (x: number, y: number) => void;
  onUpdateFlag: (x: number, y: number) => void;
  disabled?: boolean;
}

const MineCell: FC<MineCellProps> = ({
  x,
  y,
  bombs,
  fieldState,
  onExplore,
  onUpdateFlag,
  disabled = false,
}) => {
  const onFieldExplore = (e: React.MouseEvent) => {
    // Can't explore flagged or already opened field
    if (fieldState === FieldState.FLAGGED || fieldState === FieldState.OPENED)
      return;

    // Explore minefield
    onExplore(x, y);

    // Prevent default action
    e.preventDefault();
  };

  const onFieldFlag = (e: React.MouseEvent) => {
    // Can't flag already opened field
    if (fieldState === FieldState.OPENED) return;

    // Update flag
    onUpdateFlag(x, y);

    // Prevent default action
    e.preventDefault();
  };

  const renderIcon = useMemo(() => {
    if (fieldState === FieldState.OPENED) {
      if (bombs > 0) {
        return bombs;
      } else if (bombs === 0) {
        return "";
      } else {
        return <MineIcon />;
      }
    } else if (fieldState === FieldState.FLAGGED) {
      return <FlagIcon />;
    } else {
      // TODO Change to empty
      return bombs;
    }
  }, [bombs, fieldState]);

  useEffect(() => {
    console.log(fieldState);
  }, [fieldState]);

  return (
    <Button
      className={`mine-cell ${fieldState === FieldState.OPENED && "opened"} ${disabled && "disabled"}`}
      icon={renderIcon}
      onClick={onFieldExplore}
      onContextMenu={onFieldFlag}
      disabled={disabled}
    />
  );
};

export default MineCell;