import {timerInit, type TimerState} from "./timerInit";

export type TimerReducerPayload =
  | {
      action: "decrement";
    }
  | {
      action: "increment";
    }
  | {
      action: "reset";
      gameLength?: number;
      bonusTime?: number;
    }
  | {
      action: "play";
    }
  | {
      action: "pause";
    };

export function timerReducer(
  currentTimerState: TimerState,
  payload: TimerReducerPayload,
): TimerState {
  if (payload.action === "decrement") {
    const newRemainingTime = currentTimerState.remainingTime - 1;

    return {
      ...currentTimerState,
      remainingTime: newRemainingTime,
      isRunning: newRemainingTime > 0 ? currentTimerState.isRunning : false,
    };
  } else if (payload.action === "increment") {
    const newRemainingTime =
      currentTimerState.remainingTime + currentTimerState.bonusTime;

    return {
      ...currentTimerState,
      remainingTime: newRemainingTime,
      isRunning: newRemainingTime > 0 ? currentTimerState.isRunning : false,
    };
  } else if (payload.action === "reset") {
    return timerInit({...payload, useSaved: false});
  } else if (payload.action === "play") {
    return {...currentTimerState, isRunning: true};
  } else if (payload.action === "pause") {
    return {...currentTimerState, isRunning: false};
  } else {
    console.log(
      `unknown action: ${(payload as unknown as {action: string}).action}`,
    );
    return currentTimerState;
  }
}
