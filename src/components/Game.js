import React from "react";
import ControlBar from "./ControlBar";
import {Timer} from "./Timer";
import Score from "./Score";
import Board from "./Board";
import {WordResult} from "./WordResult";
import {FoundWords, AllWords} from "./FoundWords";

export default function Game({
  gameState,
  dispatchGameState,
  timerState,
  timerDispatch,
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
        timerState={timerState}
        timerDispatch={timerDispatch}
      ></ControlBar>

      <div id="stats">
        <Timer timerState={timerState} timerDispatch={timerDispatch} />
        <Score
          foundWordCount={gameState.foundWords.length}
          bonusWordCount={gameState.easyMode ? gameState.bonusWordCount : null}
          maxWordCount={gameState.allWords.length}
        ></Score>
      </div>

      {timerState.remainingTime > 0 ? (
        <FoundWords foundWords={gameState.foundWords} />
      ) : (
        <AllWords
          foundWords={gameState.foundWords}
          allWords={gameState.allWords}
        />
      )}

      <div id="currentWord">
        {gameState.playedIndexes.length > 0
          ? gameState.playedIndexes
              .map((index) => gameState.letters[index])
              .join("")
          : " "}
      </div>

      <WordResult result={gameState.result} />

      <Board
        letters={gameState.letters}
        playedIndexes={gameState.playedIndexes}
        gameOver={timerState.remainingTime <= 0}
        dispatchGameState={dispatchGameState}
      ></Board>
    </div>
  );
}
