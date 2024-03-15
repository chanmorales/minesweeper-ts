import "../../styles/Loading.css";
import MineIcon from "../icons/MineIcon";

const Loading = () => {
  return (
    <div className="loader-container">
      <div className="loader">
        <MineIcon className="logo" alt="logo" height="100%" width="100%" />
      </div>
    </div>
  );
};

export default Loading;
