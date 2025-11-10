export function inferEventsToLog(oldState, newState) {
  let analyticsToLog = [];

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
