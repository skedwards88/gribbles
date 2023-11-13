import React from "react";

export default function Settings({setDisplay, dispatchGameState}) {
  function handleNewGame(event) {
    event.preventDefault();

    dispatchGameState({
      action: "newGame",
    });
  }

  return (
    <form className="App settings" onSubmit={(e) => handleNewGame(e)}>
      <div id="settings">TODO</div>
      <div id="setting-buttons">
        <button type="submit" aria-label="new game">
          New game
        </button>
        <button
          type="button"
          aria-label="cancel"
          onClick={() => {
            setDisplay("game");
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
