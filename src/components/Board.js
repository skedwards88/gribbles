import React from "react";

function Letter({letter, letterAvailability, index, dispatchGameState}) {
  const myRef = React.useRef();

  React.useLayoutEffect(() => {
    const myDiv = myRef.current;
    const currentClasses = myDiv.className
      .split(" ")
      .filter((entry) => entry !== "unavailable");

    const newClass = letterAvailability
      ? currentClasses.join(" ")
      : [...currentClasses, "unavailable"].join(" ");

    myDiv.className = newClass;
  }, [letterAvailability]);

  function handlePointerDown(e, index) {
    e.preventDefault();
    e.target.releasePointerCapture(e.pointerId);
    dispatchGameState({
      action: "startWord",
      letterIndex: index,
    });
  }

  function handlePointerEnter(e, index, letterAvailability) {
    e.preventDefault();
    if (!letterAvailability) {
      return;
    }

    // Add the letter to the list of letters
    dispatchGameState({
      action: "addLetter",
      letterIndex: index,
    });
  }

  function handlePointerUp(e) {
    e.preventDefault();

    dispatchGameState({
      action: "endWord",
    });
  }

  return (
    <div
      className="letter"
      ref={myRef}
      onPointerDown={(e) => handlePointerDown(e, index)}
      onPointerEnter={(e) => handlePointerEnter(e, index, letterAvailability)}
      onPointerUp={(e) => handlePointerUp(e)}
      draggable={false}
    >
      {letter}
    </div>
  );
}

export default function Board({
  lettersAndIds,
  playedIndexes,
  gameOver,
  dispatchGameState,
}) {
  const board = lettersAndIds.map((letterAndID, index) => (
    <Letter
      letter={letterAndID[0]}
      letterAvailability={gameOver ? false : !playedIndexes.includes(index)}
      index={index}
      draggable={false}
      dispatchGameState={dispatchGameState}
      key={letterAndID[1]}
    ></Letter>
  ));

  return (
    <div id="board">
      {board}{" "}
    </div>
  );
}
