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
}) {
  return (
    <div id="controls">
      <button
        id="newGameButton"
        onClick={() => {
          dispatchGameState({
            action: "newGame",
          });

          setDisplay("pause");
        }}
      ></button>

      <button
        id="settingsButton"
        onClick={() => {
          setDisplay("settings");
        }}
      ></button>

      <button
        id="infoButton"
        onClick={() => {
          setDisplay("info");
        }}
      ></button>

      <button id="heartButton" onClick={() => setDisplay("heart")}></button>

      {navigator.canShare ? (
        <button
          id="shareButton"
          onClick={() => {
            setDisplay("pause");
            handleShare({
              text: "Try out this Gribbles puzzle:",
              seed: `${gameState.seed}`,
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
