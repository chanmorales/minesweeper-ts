import { FC, ImgHTMLAttributes } from "react";
import exploded from "../../assets/exploded.png";

const ExplodedIcon: FC<
  Omit<ImgHTMLAttributes<HTMLImageElement>, "onContextMenu">
> = ({ width = "32px", height = "32px", alt = "exploded", ...rest }) => (
  <img
    src={exploded}
    style={{ width: width, height: height }}
    alt={alt}
    onContextMenu={(e) => e.preventDefault()}
    {...rest}
  />
);

export default ExplodedIcon;
