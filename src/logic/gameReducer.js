import {isKnown} from "@skedwards88/word_logic";
import {gameInit} from "./gameInit";
import {checkIfNeighbors} from "@skedwards88/word_logic";
import {trie} from "./trie";

export function gameReducer(currentGameState, payload) {
  if (payload.action === "newGame") {
    return gameInit({...payload, useSaved: false});
  } else if (payload.action === "startWord") {
    return {
      ...currentGameState,
      wordInProgress: true,
      playedIndexes: [payload.letterIndex],
    };
  } else if (payload.action === "addLetter") {
    if (!currentGameState.wordInProgress) {
      return currentGameState;
    }
    // Don't add the letter if it isn't neighboring the current sequence
    const isNeighboring = checkIfNeighbors({
      indexA:
        currentGameState.playedIndexes[
          currentGameState.playedIndexes.length - 1
        ],
      indexB: payload.letterIndex,
      gridSize: Math.sqrt(currentGameState.letters.length),
    });
    if (!isNeighboring) {
      return currentGameState;
    }

    const newPlayedIndexes = [
      ...currentGameState.playedIndexes,
      payload.letterIndex,
    ];

    return {
      ...currentGameState,
      playedIndexes: newPlayedIndexes,
      result: "",
    };
  } else if (payload.action === "endWord") {
    // Since we end the word on board up or on app up (in case the user swipes off the board), we can end up calling this case twice.
    // Return early if we no longer have a word in progress.
    if (!currentGameState.wordInProgress) {
      return currentGameState;
    }

    const newWord = currentGameState.playedIndexes
      .map((index) => currentGameState.letters[index])
      .join("")
      .toUpperCase();

    // if the word is below the min length, don't add the word
    if (newWord.length < currentGameState.minWordLength) {
      return {
        ...currentGameState,
        wordInProgress: false,
        playedIndexes: [],
        result: currentGameState.playedIndexes.length <= 1 ? "" : "Too short",
      };
    }

    // if we already have the word, don't add the word
    if (currentGameState.foundWords.includes(newWord)) {
      return {
        ...currentGameState,
        wordInProgress: false,
        playedIndexes: [],
        result: "Already found",
      };
    }

    // check if word is a real word
    const {isWord, isEasy} = isKnown(newWord, trie);
    if (!isWord) {
      return {
        ...currentGameState,
        wordInProgress: false,
        playedIndexes: [],
        result: "Unknown word",
      };
    }

    // If playing in easy mode
    // and the word isn't in the easy word list,
    // consider it a bonus
    const newBonusWordCount =
      !isEasy && currentGameState.easyMode
        ? currentGameState.bonusWordCount + 1
        : currentGameState.bonusWordCount;

    const newFoundWords = [...currentGameState.foundWords, newWord];
    return {
      ...currentGameState,
      foundWords: newFoundWords,
      wordInProgress: false,
      playedIndexes: [],
      bonusWordCount: newBonusWordCount,
    };
  } else {
    console.log(`unknown action: ${payload.action}`);
    return {...currentGameState};
  }
}
