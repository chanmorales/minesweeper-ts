import { Modal, ModalProps, Radio, RadioChangeEvent, Space } from "antd";
import { FC, useCallback, useState } from "react";
import {
  Advanced,
  Easy,
  GameDifficulty,
  Intermediate,
} from "../../types/GameDifficulty";
import "../../styles/GameDifficulty.css";

interface SelectGameDifficultyDialogProps extends Pick<ModalProps, "open"> {
  onDifficultySelect: (difficulty: GameDifficulty) => void;
}

const SelectGameDifficultyDialog: FC<SelectGameDifficultyDialogProps> = ({
  open,
}) => {
  const [difficulty, setDifficulty] = useState<GameDifficulty>();

  const onChange = (e: RadioChangeEvent) => {
    setDifficulty(e.target.value);
  };

  const onOk = useCallback(() => {
    if (difficulty) {
      console.log(difficulty);
    } else {
      alert("Please select a difficulty...");
    }
  }, [difficulty]);

  return (
    <Modal
      open={open}
      closable={false}
      keyboard={false}
      styles={{
        content: { backgroundColor: "#282c34", width: "300px" },
        header: {
          backgroundColor: "#282c34",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        body: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        footer: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      }}
      title={<span className="title">Select game difficulty</span>}
      onOk={onOk}
      cancelButtonProps={{ hidden: true }}
      okText="Start"
      okButtonProps={{ style: { backgroundColor: "#00bfff", color: "black" } }}>
      <Radio.Group onChange={onChange} buttonStyle="solid" size="large">
        <Space direction="vertical">
          <Radio.Button value={Easy}>{Easy.label}</Radio.Button>
          <Radio.Button value={Intermediate}>{Intermediate.label}</Radio.Button>
          <Radio.Button value={Advanced}>{Advanced.label}</Radio.Button>
        </Space>
      </Radio.Group>
    </Modal>
  );
};

export default SelectGameDifficultyDialog;
