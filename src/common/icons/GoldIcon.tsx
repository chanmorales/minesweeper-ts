import { FC, ImgHTMLAttributes } from "react";
import gold from "../../assets/gold.png";

const GoldIcon: FC<
  Omit<ImgHTMLAttributes<HTMLImageElement>, "onContextMenu">
> = ({ width = "32px", height = "32px", alt = "gold", ...rest }) => (
  <img
    src={gold}
    style={{ width: width, height: height }}
    alt={alt}
    onContextMenu={(e) => e.preventDefault()}
    {...rest}
  />
);

export default GoldIcon;
