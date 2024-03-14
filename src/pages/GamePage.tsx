import "../styles/Game.css";
import MineField from "../components/MineField";
import { MineFieldProvider } from "../store/MineFieldStore";

const GamePage = () => {
  return (
    <MineFieldProvider>
      <div className="game-container">
        <div className="mine-field-container">
          <MineField width={30} height={16} bombs={15} />
        </div>
      </div>
    </MineFieldProvider>
  );
};

export default GamePage;
