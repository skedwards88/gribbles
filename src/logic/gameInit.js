import {letterPool} from "./letterPool";
import {shuffleArray} from "@skedwards88/word_logic";
import {findAllWords} from "@skedwards88/word_logic";
import {trie} from "./trie";

function getLetters(gridSize) {
  // Given the distribution of letters in the word list
  // Choose n letters without substitution
  const shuffledLetters = shuffleArray(letterPool);
  const chosenLetters = shuffledLetters.slice(0, gridSize * gridSize);

  return chosenLetters;
}

function getPlayableLetters({gridSize, minWordLength, easyMode}) {
  // Select letters and make sure that the computer can find at least
  // 50 words (standard mode) or 20 words (easy mode)
  // otherwise the player will not be able to find many words
  const minWords = easyMode ? 20 : 50;
  let foundPlayableLetters = false;
  let letters;
  let allWords;
  while (!foundPlayableLetters) {
    letters = getLetters(gridSize);
    allWords = findAllWords({
      grid: letters,
      minWordLength: minWordLength,
      easyMode: easyMode,
      trie,
    });
    if (allWords.length > minWords) {
      foundPlayableLetters = true;
    }
  }
  return [letters, allWords];
}

export function gameInit({gridSize, minWordLength, easyMode, useSaved = true}) {
  const savedGameState = useSaved
    ? JSON.parse(localStorage.getItem("gribblesGameState"))
    : undefined;

  const savedTimerState = useSaved
    ? JSON.parse(localStorage.getItem("gribblesTimerState"))
    : undefined;

  if (
    savedGameState &&
    savedTimerState &&
    savedTimerState.remainingTime > 0 &&
    savedGameState.foundWords &&
    savedGameState.bonusWordCount >= 0 &&
    savedGameState.minWordLength &&
    savedGameState.letters &&
    savedGameState.allWords &&
    savedGameState.easyMode
  ) {
    return {...savedGameState, playedIndexes: [], result: ""};
  }

  // use the specified settings, otherwise check local storage, otherwise use default
  gridSize = gridSize || Math.sqrt(savedGameState?.letters?.length) || 4;
  minWordLength = minWordLength || savedGameState?.minWordLength || 3;
  easyMode = easyMode ?? savedGameState?.easyMode ?? true;

  const [letters, allWords] = getPlayableLetters({
    gridSize: gridSize,
    minWordLength: minWordLength,
    easyMode: easyMode,
  });

  return {
    foundWords: [],
    bonusWordCount: 0,
    minWordLength: minWordLength,
    letters: letters,
    playedIndexes: [],
    result: "",
    allWords: allWords,
    easyMode: easyMode,
  };
}
