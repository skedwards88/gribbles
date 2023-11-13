import {letterPool} from "./letterPool";
import {shuffleArray} from "@skedwards88/word_logic";
import {findAllWords} from "@skedwards88/word_logic";
import {trie} from "./trie";
import seedrandom from "seedrandom";

export function getPseudoRandomID() {
  // todo could compare to existing IDs to ensure unique? Could string two together for increased randomness?
  const pseudoRandomGenerator = seedrandom();
  return pseudoRandomGenerator()
}

function getLetters(numLetters, pseudoRandomGenerator) {
  // Given the distribution of letters in the word list
  // Choose n letters without substitution
  const shuffledLetters = shuffleArray(letterPool, pseudoRandomGenerator);
  const chosenLetters = shuffledLetters.slice(0, numLetters);//todo need to make this more robust for case where more letters requested than in list

  return chosenLetters;
}

function getPlayableLetters({numColumns, numRows, seed}) {
  // Create a new seedable random number generator
  let pseudoRandomGenerator = seed ? seedrandom(seed) : seedrandom();

  // Select letters and make sure that the computer can find at least
  // 50 words (standard mode) or 20 words (easy mode)
  // otherwise the player will not be able to find many words
  const minWords = 5;//todo omit min word requirement? if add opportunity to shuffle, should be ok
  let foundPlayableLetters = false;
  let letters;
  let allWords;
  const numLetters = numColumns * numRows;
  while (!foundPlayableLetters) {
    letters = getLetters(numLetters, pseudoRandomGenerator);
    allWords = findAllWords({
      letters: letters,
      numColumns: numColumns,
      numRows: numRows,
      minWordLength: 2,
      easyMode: true,
      trie,
    });
    if (allWords.length > minWords) {
      foundPlayableLetters = true;
    }
  }
  return letters;
}

function getRandomSeed() {
  const currentDate = new Date();
  return currentDate.getTime().toString();
}

export function gameInit({
  seed,
  useSaved = true,
}) {
  if (!seed) {
    seed = getRandomSeed();
  }

  const savedGameState = JSON.parse(localStorage.getItem("gribblesGameState"));

  if (
    useSaved &&
    savedGameState &&
    savedGameState.lettersAndIds &&
    savedGameState.seed === seed
  ) {
    return {...savedGameState, playedIndexes: [], result: ""};
  }

  const numRows = 8;//todo play with dimensions on different screen sizes
  const numColumns = 6;

  const letters = getPlayableLetters({
    numColumns: numColumns,
    numRows: numRows,
    seed: seed,
  });

  const lettersAndIds = letters.map(letter => [letter, getPseudoRandomID()])//todo make better uuid

  return {
    lettersAndIds: lettersAndIds,
    playedIndexes: [],
    numColumns: numColumns,
    numRows: numRows,
    result: "",
    seed: seed, //todo remove seed?
  };
}
