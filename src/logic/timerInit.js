export function timerInit({gameLength, bonusTime, useSaved = true}) {
  const savedTimerState = JSON.parse(
    localStorage.getItem("gribblesTimerState"),
  );

  if (
    useSaved &&
    savedTimerState &&
    savedTimerState.bonusTime >= 0 &&
    savedTimerState.gameLength &&
    savedTimerState.remainingTime > 0
  ) {
    return {...savedTimerState, isRunning: false};
  }
  // use the specified settings, otherwise check local storage, otherwise use default
  gameLength = gameLength || savedTimerState?.gameLength || 60;
  bonusTime = bonusTime ?? savedTimerState?.bonusTime ?? 5;
  return {
    remainingTime: gameLength,
    isRunning: false,
    gameLength: gameLength,
    bonusTime: bonusTime,
  };
}
