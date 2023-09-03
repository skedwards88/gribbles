import React from "react";

export function Timer({timerState, timerDispatch}) {
  React.useEffect(() => {
    let timerID;
    if (timerState.isRunning) {
      if (timerState.remainingTime > 0) {
        timerID = setInterval(() => timerDispatch({action: "decrement"}), 1000);
      }
    }
    return () => clearInterval(timerID);
  }, [timerState.isRunning]);

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

export function TimerBlocker({timerState, timerDispatch, setDisplay}) {
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
