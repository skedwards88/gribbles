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
        gridSize: Math.sqrt(newState.letters.length),
      },
    });

    // If the old game had at least 1 found word, log a game completion event
    // (To track the actual game completion event, would need to also collect the timer state)
    if (oldState.foundWords.length > 0) {
      analyticsToLog.push({
        eventName: "completed_game",
        eventInfo: {
          numFoundWords: oldState.foundWords.length,
          numFoundBonusWords: oldState.bonusWordCount,
          numUnfoundWords:
            oldState.allWords.length - oldState.foundWords.length,
          percentFound:
            ((oldState.foundWords.length - oldState.bonusWordCount) /
              oldState.allWords.length) *
            100,
          minWordLength: oldState.minWordLength,
          easyMode: oldState.easyMode,
          gridSize: Math.sqrt(oldState.letters.length),
        },
      });
    }
  }

  // If they found an invalid word
  if (
    newState.lastInvalidWord &&
    newState.lastInvalidWord != oldState.lastInvalidWord
  ) {
    analyticsToLog.push({
      eventName: "unknown_word",
      eventInfo: {
        word: newState.lastInvalidWord,
      },
    });
  }

  return analyticsToLog;
}
