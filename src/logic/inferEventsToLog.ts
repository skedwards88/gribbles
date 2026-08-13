import type {GameState} from "./gameInit";

export function inferEventsToLog(
  oldState: GameState,
  newState: GameState,
): {
  eventName: string;
  eventInfo?: object;
}[] {
  const analyticsToLog = [];

  // If a new game was generated
  if (oldState.seed !== newState.seed) {
    analyticsToLog.push({
      eventName: "new_game",
      eventInfo: {
        minWordLength: newState.minWordLength,
        easyMode: newState.easyMode,
      },
    });
  }

  return analyticsToLog;
}
