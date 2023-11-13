import {isKnown} from "@skedwards88/word_logic";
import {gameInit} from "./gameInit";
import {checkIfNeighbors} from "@skedwards88/word_logic";
import {trie} from "./trie";
import {replaceIndexes} from "./arrayToColumns";

// todo update this function in the word_logic pkg
// function checkIfNeighbors({ indexA, indexB, numColumns, numRows }) {
//   // Check if two indexes are neighbors in a grid
//   // given the two indexes and the grid size
//   // If only one index is provided, returns true

//   if (indexA === undefined || indexB === undefined) {
//     return true;
//   }

//   const surroundingIndexes = getSurroundingIndexes({
//     index: indexB,
//     numColumns: numColumns,
//     numRows: numRows,
//   });

//   return surroundingIndexes.includes(indexA) ? true : false;
// }
// todo update this function in the word_logic pkg
// function getSurroundingIndexes({ index, numColumns, numRows }) {
//   const column = index % numColumns;
//   const row = Math.floor(index / numColumns);
//   let surroundingIndexes = [];
//   for (let currentRow = row - 1; currentRow <= row + 1; currentRow++) {
//     for (
//       let currentColumn = column - 1;
//       currentColumn <= column + 1;
//       currentColumn++
//     ) {
//       if (
//         currentRow >= 0 &&
//         currentColumn >= 0 &&
//         currentRow < numRows &&
//         currentColumn < numColumns
//       ) {
//         const currentIndex = currentColumn + currentRow * numColumns;
//         surroundingIndexes.push(currentIndex);
//       }
//     }
//   }
//   console.log("surroundingIndexes: ", surroundingIndexes)
//   return surroundingIndexes;
// }

export function gameReducer(currentGameState, payload) {
  if (payload.action === "newGame") {
    return gameInit({
      ...payload,
      seed: undefined,
      useSaved: false,
    });
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
      numColumns: currentGameState.numColumns,
      numRows: currentGameState.numRows,
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
      .map((index) => currentGameState.lettersAndIds[index][0])
      .join("")
      .toUpperCase();

    // if the word is less than 2, don't add the word
    if (newWord.length < 2) {
      return {
        ...currentGameState,
        wordInProgress: false,
        playedIndexes: [],
        result: currentGameState.playedIndexes.length <= 1 ? "" : "Too short",
      };
    }

    // check if word is a real word
    const {isWord} = isKnown(newWord, trie);
    if (!isWord) {
      return {
        ...currentGameState,
        wordInProgress: false,
        playedIndexes: [],
        result: "Unknown word",
      };
    }

    const newLettersAndIds = replaceIndexes(
      currentGameState.lettersAndIds,
      currentGameState.playedIndexes,
      currentGameState.numColumns,
      currentGameState.numRows,
    );

    return {
      ...currentGameState,
      wordInProgress: false,
      playedIndexes: [],
      lettersAndIds: newLettersAndIds,
    };
  } else {
    console.log(`unknown action: ${payload.action}`);
    return {...currentGameState};
  }
}
