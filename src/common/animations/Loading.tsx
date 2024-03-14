import "../../styles/Loading.css";
import mine from "../../assets/mine.svg";

const Loading = () => {
  return (
    <div className="loader-container">
      <div className="loader">
        <img src={mine} className="logo" alt="logo" />
      </div>
    </div>
  );
};

export default Loading;
