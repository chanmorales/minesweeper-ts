import { FC } from "react";
import { Modal } from "antd";

interface GameOverDialogProps {
  open: boolean;
}

const GameOverDialog: FC<GameOverDialogProps> = ({ open }) => {
  return <Modal open={open}>{"Game Over"}</Modal>;
};

export default GameOverDialog;