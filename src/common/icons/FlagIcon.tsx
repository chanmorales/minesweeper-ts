import flag from "../../assets/flag.png";

const FlagIcon = () => (
  <img
    src={flag}
    style={{ width: "20px", height: "20px" }}
    alt="flag"
    onContextMenu={(e) => e.preventDefault()}
  />
);

export default FlagIcon;