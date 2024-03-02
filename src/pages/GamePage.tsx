import "../styles/Game.css";
import MineField from "../components/MineField";
import GameDetails from "../components/GameDetails";

const GamePage = () => {
  return (
    <div className="game-container">
      <div className="mine-field-container">
        <MineField width={30} height={16} bombs={99} />
      </div>
      <div className="game-details-container">
        <GameDetails />
      </div>
    </div>
  );
};

export default GamePage;