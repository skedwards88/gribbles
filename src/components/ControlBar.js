import React from "react";
import {isRunningStandalone} from "@skedwards88/shared-components/src/logic/isRunningStandalone";
import Share from "@skedwards88/shared-components/src/components/Share";
import {handleShare} from "@skedwards88/shared-components/src/logic/handleShare";
import {useMetadataContext} from "@skedwards88/shared-components/src/components/MetadataContextProvider";

export default function ControlBar({
  gameState,
  dispatchGameState,
  setDisplay,
  timerState,
  timerDispatch,
}) {
  const {userId, sessionId} = useMetadataContext();

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

      <Share
        id="shareButton"
        className="controlButton"
        onClick={() => {
          timerDispatch({action: "pause"});
          setDisplay("pause");
          handleShare({
            appName: "Gribbles",
            text: "Try out this Gribbles puzzle!",
            url: `https://skedwards88.github.io/gribbles/?puzzle=${
              gameState.seed
            }_${Math.sqrt(gameState.letters.length)}_${
              gameState.minWordLength
            }_${gameState.easyMode ? "e" : "h"}`,
            origin: "control bar",
          });
        }}
        userId={userId}
        sessionId={sessionId}
      ></Share>

      {!isRunningStandalone() ? (
        <button
          id="installButton"
          onClick={() => setDisplay("installOverview")}
        ></button>
      ) : (
        <></>
      )}
    </div>
  );
}
