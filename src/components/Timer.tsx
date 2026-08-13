import React from "react";
import type {TimerReducerPayload} from "../logic/timerReducer";
import type {TimerState} from "../logic/timerInit";
import type {DisplayState} from "./App";

export function Timer({
  timerState,
  timerDispatch,
}: {
  timerState: TimerState;
  timerDispatch: React.Dispatch<TimerReducerPayload>;
}): React.JSX.Element {
  React.useEffect(() => {
    let timerID: NodeJS.Timeout | undefined;
    if (timerState.isRunning) {
      timerID = setInterval(() => timerDispatch({action: "decrement"}), 1000);
    }
    return (): void => clearInterval(timerID);
  }, [timerState.isRunning, timerDispatch]);

  let display;
  if (timerState.remainingTime > 0) {
    const minutes = Math.floor(timerState.remainingTime / 60);
    const seconds = timerState.remainingTime % 60;
    const displaySeconds = seconds < 10 ? `0${seconds}` : seconds;
    display = `${minutes}:${displaySeconds}`;
  } else {
    display = "GAME OVER";
  }

  return <div>{display}</div>;
}

export function TimerBlocker({
  timerState,
  timerDispatch,
  setDisplay,
}: {
  timerState: TimerState;
  timerDispatch: React.Dispatch<TimerReducerPayload>;
  setDisplay: React.Dispatch<React.SetStateAction<DisplayState>>;
}): React.JSX.Element {
  if (timerState.remainingTime <= 0) {
    return <div className="App fadeOut">{"GAME OVER!"}</div>;
  }

  if (!timerState.isRunning) {
    const command =
      timerState.remainingTime === timerState.gameLength ? "Play" : "Resume";
    return (
      <div
        className="App"
        id="paused"
        onClick={() => {
          timerDispatch({action: "play"});
          setDisplay("game");
        }}
      >{`Tap to ${command}`}</div>
    );
  }

  return <></>;
}
