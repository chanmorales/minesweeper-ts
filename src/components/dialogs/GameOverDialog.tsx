import { FC } from "react";
import { Modal } from "antd";

interface GameOverDialogProps {
  open: boolean;
  onCancel: () => void;
}

const GameOverDialog: FC<GameOverDialogProps> = ({ open, onCancel }) => {
  return (
    <Modal open={open} onCancel={onCancel}>
      {"Game Over"}
    </Modal>
  );
};

export default GameOverDialog;