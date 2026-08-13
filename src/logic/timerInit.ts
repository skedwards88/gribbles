import {getFromStorage} from "@skedwards88/shared-components/src/logic/safeStorage";

export type TimerState = {
  remainingTime: number;
  isRunning: boolean;
  gameLength: number;
  bonusTime: number;
};

export function timerInit({
  gameLength,
  bonusTime,
  useSaved = true,
}: {
  gameLength?: number;
  bonusTime?: number;
  useSaved?: boolean;
}): TimerState {
  const savedTimerState = getFromStorage<TimerState>("gribblesTimerState");

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
