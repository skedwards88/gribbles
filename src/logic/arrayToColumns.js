import {letterPool} from "./letterPool";

import { getPseudoRandomID } from "./gameInit";

// todo add tests

function arrayToColumns(array, numColumns) {
  // todo what if irregular number of columns or fewer array items than num columns? add test cases

  let columns = [];
  for (let columnIndex = 0; columnIndex < numColumns; columnIndex++) {
    let column = [];
    let nextArrayIndex = columnIndex;
    while (nextArrayIndex < array.length) {
      column.push(nextArrayIndex);
      nextArrayIndex = nextArrayIndex + numColumns;
    }
    columns.push(column);
  }
  return columns;
}

function columnsToArray(columns) {
  let array = [];
  for (let rowIndex = 0; rowIndex < columns[0].length; rowIndex++) {
    for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
      const item = columns[columnIndex][rowIndex];
      if (item != undefined) {
        array.push(item);
      }
    }
  }

  return array;
}

function pickRandom(inputArray) {
  return inputArray[Math.floor(Math.random() * inputArray.length)];
}

function padLetters(array, size) {
  // todo handle array longer than size
  while (array.length < size) {
    const newLetter = pickRandom(letterPool);
    const newID = getPseudoRandomID()
    array = [[newLetter, newID], ...array];
  }
  return array;
}

export function replaceIndexes(letters, indexesToReplace, numColumns, numRows) {
  const allIndexes = letters.map((_, index) => index);
  const indexColumns = arrayToColumns(allIndexes, numColumns);
  const newColumns = [];
  for (const column of indexColumns) {
    const remainingColumnIndexes = column.filter(
      (index) => !indexesToReplace.includes(index),
    );
    const remainingColumnLetters = remainingColumnIndexes.map(
      (index) => letters[index],
    );
    const paddedColumn = padLetters(remainingColumnLetters, numRows);
    newColumns.push(paddedColumn);
  }

  const newLetters = columnsToArray(newColumns);

  return newLetters;
}
