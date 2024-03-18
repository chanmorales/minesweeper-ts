import { Button } from "antd";
import { PauseCircleFilled } from "@ant-design/icons";
import { useTimer } from "../hooks/useTimer";
import { FC, useEffect, useMemo } from "react";

interface TimerProps {
  onPausePlay?: () => void;
}

const Timer: FC<TimerProps> = ({ onPausePlay }) => {
  const {
    state: { elapsedSeconds, isActive },
    timerDispatch,
  } = useTimer();

  const timerDisplay = useMemo(() => {
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = Math.floor(elapsedSeconds % 60);

    return (
      `${hours > 0 ? String(hours).padStart(2, "0") + ":" : ""}` +
      `${String(minutes).padStart(2, "0") + ":"}` +
      `${String(seconds).padStart(2, "0")}`
    );
  }, [elapsedSeconds]);

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (isActive) {
      interval = setInterval(() => {
        timerDispatch({
          type: "INCREMENT_ELAPSED_SECONDS",
          payload: elapsedSeconds + 1,
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerDispatch, elapsedSeconds, isActive]);

  return (
    <>
      {timerDisplay}
      <Button
        className="timer-pause-icon border-none text-white"
        icon={<PauseCircleFilled />}
        onClick={onPausePlay}
      />
    </>
  );
};

export default Timer;
