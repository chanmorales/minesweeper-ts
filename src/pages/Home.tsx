import "../styles/animation.css";
import "../styles/Home.css";
import mine from "../assets/mine.svg";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const startGame = () => {
    navigate("/game");
  };

  return (
    <div className="home-container">
      <img className="home-logo" src={mine} alt="app-logo" />
      <div className="home-title text-center mt-[20px]">
        <h1 className="Title text-4xl font-bold text-gray-400">MINESWEEPER</h1>
      </div>
      <Button className="home-start-game-btn" onClick={startGame}>
        Start Game
      </Button>
    </div>
  );
};

export default Home;
