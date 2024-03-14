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
      <div id="flag-count-container" className="flex justify-center">
        <div id="flag-icon-container" className="">
          <FlagIcon />
        </div>
        {`: ${bombs - state.flagCount}`}
      </div>
    </>
  );
};

export default GameDetails;
