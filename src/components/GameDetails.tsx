import FlagIcon from "../common/icons/FlagIcon";
import { useMineField } from "../hooks/useMineField";
import { ClockCircleFilled, ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Popover, Typography } from "antd";

const GameDetails = () => {
  const {
    state: { difficulty, flagCount },
  } = useMineField();

  const { Text } = Typography;

  return (
    <>
      <div
        id="game-details-container"
        className="flex justify-between relative">
        <div id="timer-container" className="absolute">
          <ClockCircleFilled color="white" className="mr-1" />
          {
            // TODO Timer
            "00:00"
          }
        </div>
        <div
          id="flag-count-container"
          className="flex absolute right-0 items-center">
          <FlagIcon className="mr-1" />
          <span>{`: ${(difficulty?.bombs ?? 0) - flagCount}`}</span>
          <Popover
            trigger="click"
            content={
              <>
                <Text strong>{"Difficulty"}</Text>
                <Text>{`: ${difficulty?.label ?? ""}`}</Text>
                <br />
                <Text strong>{"Dimension"}</Text>
                <Text>{`: ${difficulty?.width ?? ""} x ${difficulty?.height ?? ""}`}</Text>
                <br />
                <Text strong>{"# of Mines"}</Text>
                <Text>{`: ${difficulty?.bombs ?? ""}`}</Text>
              </>
            }>
            <Button
              icon={<ExclamationCircleFilled />}
              className="game-details-hint ml-1 border-none text-white"
            />
          </Popover>
        </div>
      </div>
    </>
  );
};

export default GameDetails;
