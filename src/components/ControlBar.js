import React from "react";
import {handleInstall} from "../logic/handleInstall";

export default function ControlBar({
  dispatchGameState,
  setDisplay,
  setInstallPromptEvent,
  showInstallButton,
  installPromptEvent,
  timerState,
  timerDispatch,
}) {
  return (
    <div id="controls">
      <button
        id="pauseButton"
        onClick={() => {
          timerDispatch({action: "pause"});
          setDisplay("pause");
        }}
        disabled={!timerState.isRunning || timerState.remainingTime <= 0}
      ></button>

      <button
        id="newGameButton"
        onClick={() => {
          dispatchGameState({
            action: "newGame",
            // todo can just pass along game state in reducer for the following params?
            // gridSize: Math.sqrt(gameState.letters.length),
            // minWordLength: gameState.minWordLength,
            // easyMode: gameState.easyMode,
          });

          timerDispatch({
            action: "reset",
            gameLength: timerState.gameLength,
          });
          setDisplay("pause");
        }}
      ></button>

      <button
        id="settingsButton"
        onClick={() => {
          timerDispatch({action: "pause"});
          setDisplay("settings");
        }}
      ></button>

      <button
        id="infoButton"
        onClick={() => {
          timerDispatch({action: "pause"});
          setDisplay("info");
        }}
      ></button>

      <button id="heartButton" onClick={() => setDisplay("heart")}></button>
      {showInstallButton && installPromptEvent ? (
        <button
          id="installButton"
          onClick={() =>
            handleInstall(installPromptEvent, setInstallPromptEvent)
          }
        ></button>
      ) : (
        <></>
      )}
    </div>
  );
}
