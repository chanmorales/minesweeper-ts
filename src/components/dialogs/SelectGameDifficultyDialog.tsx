import {
  message,
  Modal,
  ModalProps,
  Radio,
  RadioChangeEvent,
  Space,
} from "antd";
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
  onDifficultySelect,
  open,
}) => {
  const [difficulty, setDifficulty] = useState<GameDifficulty>();
  const [messageApi, contextHolder] = message.useMessage();

  const onChange = (e: RadioChangeEvent) => {
    setDifficulty(e.target.value);
  };

  const warning = useCallback(() => {
    messageApi.warning({
      content: "Please select a game difficulty",
    });
  }, [messageApi]);

  const onOk = useCallback(() => {
    if (difficulty) {
      onDifficultySelect(difficulty);
    } else {
      warning();
    }
  }, [difficulty, onDifficultySelect, warning]);

  return (
    <Modal
      open={open}
      closable={false}
      keyboard={false}
      centered
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
      {contextHolder}
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
