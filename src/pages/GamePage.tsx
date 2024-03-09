import "../styles/Game.css";
import MineField from "../components/MineField";
import GameDetails from "../components/GameDetails";
import { MineFieldProvider } from "../store/MineFieldStore";

const GamePage = () => {
  return (
    <div className="game-container">
      <div className="mine-field-container">
        <MineFieldProvider>
          <MineField width={30} height={16} bombs={99} />
        </MineFieldProvider>
      </div>
      <div className="game-details-container">
        <GameDetails />
      </div>
    </div>
  );
};

export default GamePage;