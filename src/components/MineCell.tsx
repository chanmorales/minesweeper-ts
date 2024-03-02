import React, { FC, useMemo, useState } from "react";
import "../styles/Game.css";
import { Button } from "antd";
import MineIcon from "../common/icons/MineIcon";
import FlagIcon from "../common/icons/FlagIcon";

interface MineCellProps {
  x: number;
  y: number;
  bombs: number;
  onOpen: (x: number, y: number) => void;
  disabled?: boolean;
}

const MineCell: FC<MineCellProps> = ({
  x,
  y,
  bombs,
  onOpen,
  disabled = false,
}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [isFlagged, setIsFlagged] = useState(false);

  const handleLeftClick = (e: React.MouseEvent) => {
    // Flagged mine can't be opened, as well as already opened mine
    if (isFlagged || isOpened) return;
    setIsOpened(true);

    onOpen(x, y);

    // Prevent default action
    e.preventDefault();
  };

  const handleRightClick = (e: React.MouseEvent) => {
    // Opened mine can't be flagged / un-flagged anymore
    if (isOpened) return;
    setIsFlagged(!isFlagged);

    // Prevent default action
    e.preventDefault();
  };

  const renderIcon = useMemo(() => {
    if (isOpened) {
      if (bombs > 0) {
        return bombs;
      } else if (bombs === 0) {
        return "";
      } else {
        return <MineIcon />;
      }
    } else {
      if (isFlagged) {
        return <FlagIcon />;
      } else {
        // Change to empty
        return bombs;
      }
    }
  }, [bombs, isFlagged, isOpened]);

  return (
    <Button
      className={`mine-cell ${isOpened && "opened"} ${disabled && "disabled"}`}
      icon={renderIcon}
      onClick={handleLeftClick}
      onContextMenu={handleRightClick}
      disabled={disabled}
    />
  );
};

export default MineCell;