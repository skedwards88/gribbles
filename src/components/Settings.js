import React from "react";

export default function Settings({
  setDisplay,
  dispatchGameState,
  gameState,
  timerState,
  timerDispatch,
}) {
  function handleNewGame(event) {
    event.preventDefault();

    const newGridSize = parseInt(event.target.elements.gridSize.value);
    const newMinWordLength = parseInt(
      event.target.elements.minWordLength.value,
    );
    const newGameLength = parseInt(event.target.elements.gameLength.value);
    const newBonusTime = parseInt(event.target.elements.bonusTime.value);
    const newEasyMode = event.target.elements.easyMode.checked;

    dispatchGameState({
      action: "newGame",
      gridSize: newGridSize,
      minWordLength: newMinWordLength,
      easyMode: newEasyMode,
    });

    timerDispatch({
      action: "reset",
      gameLength: newGameLength,
      bonusTime: newBonusTime,
    });

    setDisplay("pause");
  }

  return (
    <form className="App settings" onSubmit={(e) => handleNewGame(e)}>
      <div id="settings">
        <div className="setting">
          <div className="setting-description">
            <label htmlFor="gridSize">Grid size</label>
          </div>
          <select
            id="gridSize"
            defaultValue={Math.sqrt(gameState.letters.length)}
          >
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>

        <div className="setting">
          <div className="setting-description">
            <label htmlFor="minWordLength">Min word length</label>
          </div>
          <select id="minWordLength" defaultValue={gameState.minWordLength}>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>

        <div className="setting">
          <div className="setting-description">
            <label htmlFor="gameLength">Base time</label>
          </div>
          <select id="gameLength" defaultValue={timerState.gameLength}>
            <option value="15">15 sec</option>
            <option value="30">30 sec</option>
            <option value="60">1 min</option>
            <option value="120">2 min</option>
            <option value="180">3 min</option>
            <option value="240">4 min</option>
            <option value="300">5 min</option>
            <option value="360">6 min</option>
            <option value="420">7 min</option>
            <option value="480">8 min</option>
            <option value="540">9 min</option>
          </select>
        </div>

        <div className="setting">
          <div className="setting-description">
            <label htmlFor="bonusTime">Added time/word</label>
            <div className="setting-info">
              Increase the remaining time when you find a word.
            </div>
          </div>
          <select id="bonusTime" defaultValue={timerState.bonusTime}>
            <option value="0">0 sec</option>
            <option value="5">5 sec</option>
            <option value="10">10 sec</option>
          </select>
        </div>

        <div className="setting">
          <div className="setting-description">
            <label htmlFor="easyMode">Easy mode</label>
            <div className="setting-info">
              In easy mode, the computer only finds common words. You get bonus
              points for finding extra words.
            </div>
          </div>
          <input
            id="easyMode"
            type="checkbox"
            defaultChecked={gameState.easyMode}
          />
        </div>
      </div>
      <div id="setting-buttons">
        <button type="submit" aria-label="new game">
          New game
        </button>
        <button
          type="button"
          aria-label="cancel"
          onClick={() => {
            timerDispatch({action: "play"});
            setDisplay("game");
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
