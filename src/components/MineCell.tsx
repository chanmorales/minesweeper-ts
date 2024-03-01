import React, { FC, useMemo, useState } from "react";
import "../styles/Game.css";
import { Button } from "antd";
import MineIcon from "../common/icons/MineIcon";
import FlagIcon from "../common/icons/FlagIcon";

interface MineCellProps {
  bombs: number;
}

const MineCell: FC<MineCellProps> = ({ bombs }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [isFlagged, setIsFlagged] = useState(false);

  const handleLeftClick = (e: React.MouseEvent) => {
    // Flagged mine can't be opened, as well as already opened mine
    if (isFlagged || isOpened) return;
    setIsOpened(true);

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
        return "";
      }
    }
  }, [bombs, isFlagged, isOpened]);

  return (
    <Button
      className={`mine-cell ${isOpened && "opened"}`}
      icon={renderIcon}
      onClick={handleLeftClick}
      onContextMenu={handleRightClick}
    />
  );
};

export default MineCell;