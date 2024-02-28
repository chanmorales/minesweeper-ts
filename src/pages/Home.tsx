import "../styles/animation.css";
import "../styles/Home.css";
import mine from "../assets/mine.svg";

const Home = () => (
  <div className="HomeContainer">
    <header className="Header">
      <img className="Logo" src={mine} alt="app-logo" />
      <div className="TitleContainer text-center mt-[20px]">
        <h1 className="Title text-4xl font-bold text-gray-400">MINESWEEPER</h1>
      </div>
    </header>
  </div>
);

export default Home;
