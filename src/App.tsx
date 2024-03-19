import Home from "./pages/Home";
import { HashRouter, Route, Routes } from "react-router-dom";
import GamePage from "./pages/GamePage";

const App = () => {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
      </HashRouter>
    </div>
  );
};

export default App;
