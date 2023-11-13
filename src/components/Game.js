import React from "react";
import ControlBar from "./ControlBar";
import Score from "./Score";
import Board from "./Board";
import {WordResult} from "./WordResult";

export default function Game({
  gameState,
  dispatchGameState,
  setDisplay,
  setInstallPromptEvent,
  showInstallButton,
  installPromptEvent,
}) {
  return (
    <div
      className="App"
      id="gribbles"
      onPointerUp={(e) => {
        e.preventDefault();

        dispatchGameState({
          action: "endWord",
        });
      }}
    >
      <ControlBar
        gameState={gameState}
        dispatchGameState={dispatchGameState}
        setDisplay={setDisplay}
        setInstallPromptEvent={setInstallPromptEvent}
        showInstallButton={showInstallButton}
        installPromptEvent={installPromptEvent}
      ></ControlBar>

      <div id="stats">
        <Score></Score>
      </div>

      <div id="currentWord">
        {gameState.playedIndexes.length > 0
          ? gameState.playedIndexes
              .map((index) => gameState.letterData[index].letter)
              .join("")
              .toUpperCase()
          : " "}
      </div>

      <WordResult result={gameState.result} />

      <Board
        letterData={gameState.letterData}
        playedIndexes={gameState.playedIndexes}
        gameOver={false} //todo
        dispatchGameState={dispatchGameState}
      ></Board>
    </div>
  );
}
