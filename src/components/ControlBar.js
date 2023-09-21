import React from "react";
import {handleInstall} from "../logic/handleInstall";
import {handleShare} from "./Share";

export default function ControlBar({
  gameState,
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

      {navigator.canShare ? (
        <button
          id="shareButton"
          onClick={() => {
            timerDispatch({action: "pause"});
            setDisplay("pause");
            handleShare({
              text: "Try out this Gribbles puzzle:",
              seed: `${gameState.seed}_${Math.sqrt(gameState.letters.length)}_${
                gameState.minWordLength
              }_${gameState.easyMode ? "e" : "h"}`,
            });
          }}
        ></button>
      ) : (
        <></>
      )}

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
