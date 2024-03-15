import { FC, ImgHTMLAttributes } from "react";
import mine from "../../assets/mine.svg";

const MineIcon: FC<
  Omit<ImgHTMLAttributes<HTMLImageElement>, "onContextMenu">
> = ({ width = "20px", height = "20px", alt = "mine", ...rest }) => (
  <img
    src={mine}
    style={{ height: height, width: width }}
    alt={alt}
    onContextMenu={(e) => e.preventDefault()}
    {...rest}
  />
);

export default MineIcon;
