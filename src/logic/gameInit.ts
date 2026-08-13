import {letterPool} from "./letterPool";
import {shuffleArray} from "@skedwards88/word_logic";
import {findAllWords} from "@skedwards88/word_logic";
import {trie} from "./trie";
import seedrandom from "seedrandom";
import {getRandomSeed} from "@skedwards88/shared-components/src/logic/getRandomSeed";
import type {LetterQu} from "@skedwards88/word_logic/dist/Types";
import {getFromStorage} from "@skedwards88/shared-components/src/logic/safeStorage";
import {type TimerState} from "./timerInit";

export type GameState = {
  foundWords: string[];
  bonusWordCount: number;
  minWordLength: number;
  letters: LetterQu[];
  playedIndexes: number[];
  result: string;
  allWords: string[];
  easyMode: boolean;
  wordInProgress: boolean;
  seed: string;
};

function getLetters(
  gridSize: number,
  pseudoRandomGenerator: seedrandom.PRNG,
): LetterQu[] {
  // Given the distribution of letters in the word list
  // Choose n letters without substitution
  const shuffledLetters = shuffleArray(letterPool, pseudoRandomGenerator);
  const chosenLetters = shuffledLetters.slice(0, gridSize * gridSize);

  return chosenLetters;
}

function getPlayableLetters({
  gridSize,
  minWordLength,
  easyMode,
  seed,
}: {
  gridSize: number;
  minWordLength: number;
  easyMode: boolean;
  seed: string;
}): [LetterQu[], string[]] {
  // Create a new seedable random number generator
  const pseudoRandomGenerator = seed ? seedrandom(seed) : seedrandom();

  // Select letters and make sure that the computer can find at least
  // 50 words (standard mode) or 20 words (easy mode)
  // otherwise the player will not be able to find many words
  const minWords = easyMode ? 20 : 50;

  let foundPlayableLetters = false;
  let letters: LetterQu[] = [];
  let allWords: string[] = [];

  while (!foundPlayableLetters) {
    letters = getLetters(gridSize, pseudoRandomGenerator);

    allWords = findAllWords({
      letters,
      numColumns: Math.sqrt(letters.length),
      numRows: Math.sqrt(letters.length),
      minWordLength,
      easyMode,
      trie,
    });

    if (allWords.length > minWords) {
      foundPlayableLetters = true;
    }
  }

  return [letters, allWords];
}

export function gameInit({
  gridSize,
  minWordLength,
  easyMode,
  seed,
  useSaved = true,
}: {
  gridSize?: number;
  minWordLength?: number;
  easyMode?: boolean;
  seed?: string;
  useSaved?: boolean;
}): GameState {
  if (!seed) {
    seed = getRandomSeed();
  }

  const savedGameState = getFromStorage<GameState>("gribblesGameState");

  const savedTimerState = getFromStorage<TimerState>("gribblesTimerState");

  if (
    useSaved &&
    savedGameState &&
    savedTimerState &&
    savedTimerState.remainingTime > 0 &&
    savedGameState.foundWords &&
    savedGameState.bonusWordCount >= 0 &&
    savedGameState.minWordLength == minWordLength &&
    savedGameState.letters &&
    Math.sqrt(savedGameState.letters.length) == gridSize &&
    savedGameState.allWords &&
    savedGameState.easyMode == easyMode &&
    savedGameState.seed === seed
  ) {
    return {
      ...savedGameState,
      playedIndexes: [],
      result: "",
    };
  }

  // use the specified settings, otherwise check local storage, otherwise use default
  gridSize =
    gridSize ||
    (savedGameState?.letters?.length &&
      Math.sqrt(savedGameState?.letters?.length)) ||
    4;
  minWordLength = minWordLength || savedGameState?.minWordLength || 3;
  easyMode = easyMode ?? savedGameState?.easyMode ?? true;

  const [letters, allWords] = getPlayableLetters({
    gridSize,
    minWordLength,
    easyMode,
    seed,
  });

  return {
    foundWords: [],
    bonusWordCount: 0,
    minWordLength,
    letters: letters,
    playedIndexes: [],
    result: "",
    allWords: allWords,
    easyMode,
    seed,
    wordInProgress: false,
  };
}
