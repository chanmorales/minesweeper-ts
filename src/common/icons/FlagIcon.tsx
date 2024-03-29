import { FC, ImgHTMLAttributes } from "react";
import flag from "../../assets/flag.png";

const FlagIcon: FC<
  Omit<ImgHTMLAttributes<HTMLImageElement>, "onContextMenu">
> = ({ width = "20px", height = "20px", alt = "flag", ...rest }) => (
  <img
    src={flag}
    style={{ width: width, height: height }}
    alt={alt}
    onContextMenu={(e) => e.preventDefault()}
    {...rest}
  />
);

export default FlagIcon;
