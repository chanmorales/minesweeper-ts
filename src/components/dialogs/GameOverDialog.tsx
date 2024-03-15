import { FC } from "react";
import { Modal, ModalProps } from "antd";
import ExplodedIcon from "../../common/icons/ExplodedIcon";
import GoldIcon from "../../common/icons/GoldIcon";

interface GameOverDialogProps extends Pick<ModalProps, "open"> {
  onClose?: () => void;
  isExploded: boolean;
}

const GameOverDialog: FC<GameOverDialogProps> = ({
  open,
  onClose,
  isExploded,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      styles={{
        content: { backgroundColor: "#282c34" },
        body: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "white",
        },
        footer: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      }}
      cancelButtonProps={{ hidden: true }}
      okButtonProps={{ style: { backgroundColor: "yellow", color: "black" } }}
      okText="New Game">
      <div className="game-over-dialog">
        <div className="logo-container w-[100%]">
          {isExploded ? (
            <ExplodedIcon height="200px" width="200px" />
          ) : (
            <GoldIcon height="200px" width="200px" />
          )}
        </div>
        <div style={{ marginTop: "10px" }}>{"GAME OVER"}</div>
      </div>
    </Modal>
  );
};

export default GameOverDialog;
