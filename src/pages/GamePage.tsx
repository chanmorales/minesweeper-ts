import "../styles/Game.css";
import MineField from "../components/MineField";
import { MineFieldProvider } from "../store/MineFieldStore";
import { TimerProvider } from "../store/TimerStore";

const GamePage = () => {
  return (
    <MineFieldProvider>
      <TimerProvider>
        <div className="game-container">
          <div className="mine-field-container">
            <MineField />
          </div>
        </div>
      </TimerProvider>
    </MineFieldProvider>
  );
};

export default GamePage;
