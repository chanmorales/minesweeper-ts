import FlagIcon from "../common/icons/FlagIcon";
import { FC } from "react";
import { useMineField } from "../hooks/useMineField";

interface GameDetailsProps {
  bombs: number;
}

const GameDetails: FC<GameDetailsProps> = ({ bombs }) => {
  const { state } = useMineField();

  return (
    <>
      <div
        id="game-details-container"
        className="flex justify-between relative">
        <div id="game-difficulty-container" className="absolute">
          {
            // TODO Change this static value
            "Difficulty: Extreme"
          }
        </div>
        <div
          id="timer-container"
          className="absolute left-[50%]"
          style={{ transform: "translateX(-50%)" }}>
          {
            // TODO Timer
            "00:00"
          }
        </div>
        <div id="flag-count-container" className="flex absolute right-2.5">
          <FlagIcon className="mr-1" />
          {`: ${bombs - state.flagCount}`}
        </div>
      </div>
    </>
  );
};

export default GameDetails;
