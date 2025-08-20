import React from "react";
import {gameInit} from "../logic/gameInit";
import {gameReducer} from "../logic/gameReducer";
import Game from "./Game";
import Settings from "./Settings";
import Rules from "./Rules";
import MoreGames from "@skedwards88/shared-components/src/components/MoreGames";
import {TimerBlocker} from "./Timer";
import {
  handleAppInstalled,
  handleBeforeInstallPrompt,
} from "../logic/handleInstall";
import {timerInit} from "../logic/timerInit";
import {timerReducer} from "../logic/timerReducer";

function parseURLQuery() {
  // Get the seed and game settings from the query params
  // Only the game settings that would affect the board are shared
  const searchParams = new URLSearchParams(document.location.search);
  const seedQuery = searchParams.get("puzzle");
  // The seed query consists of parts separated by an underscore
  let seed, gridSize, minWordLength, easyMode;
  if (seedQuery) {
    [seed, gridSize, minWordLength, easyMode] = seedQuery.split("_");
    gridSize = parseInt(gridSize);
    minWordLength = parseInt(minWordLength);
    easyMode = easyMode === "e";
  }

  return [seed, gridSize, minWordLength, easyMode];
}

export default function App() {
  const [seed, gridSize, minWordLength, easyMode] = parseURLQuery();

  const [display, setDisplay] = React.useState("pause");
  const [installPromptEvent, setInstallPromptEvent] = React.useState();
  const [showInstallButton, setShowInstallButton] = React.useState(true);

  const [gameState, dispatchGameState] = React.useReducer(
    gameReducer,
    {
      seed,
      gridSize,
      minWordLength,
      easyMode,
    },
    gameInit,
  );

  const [timerState, timerDispatch] = React.useReducer(
    timerReducer,
    {
      useSaved: seed ? false : true,
    },
    timerInit,
  );

  React.useEffect(() => {
    if (gameState.foundWords.length > 0) {
      timerDispatch({action: "increment"});
    }
  }, [gameState.foundWords]);

  React.useEffect(() => {
    window.localStorage.setItem("gribblesGameState", JSON.stringify(gameState));
  }, [gameState]);

  React.useEffect(() => {
    window.localStorage.setItem(
      "gribblesTimerState",
      JSON.stringify(timerState),
    );
  }, [timerState]);

  function handleVisibilityChange() {
    // Pause the timer if the page is hidden
    if (
      (document.hidden || document.msHidden || document.webkitHidden) &&
      timerState.isRunning
    ) {
      timerDispatch({action: "pause"});
      setDisplay("pause");
    }
  }

  React.useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  });

  React.useEffect(() => {
    const listener = (event) =>
      handleBeforeInstallPrompt(
        event,
        setInstallPromptEvent,
        setShowInstallButton,
      );

    window.addEventListener("beforeinstallprompt", listener);
    return () => window.removeEventListener("beforeinstallprompt", listener);
  }, []);

  React.useEffect(() => {
    const listener = () =>
      handleAppInstalled(setInstallPromptEvent, setShowInstallButton);

    window.addEventListener("appinstalled", listener);
    return () => window.removeEventListener("appinstalled", listener);
  }, []);

  switch (display) {
    case "settings":
      return (
        <Settings
          setDisplay={setDisplay}
          dispatchGameState={dispatchGameState}
          gameState={gameState}
          timerState={timerState}
          timerDispatch={timerDispatch}
        />
      );

    case "heart":
      return (
        <MoreGames
          setDisplay={setDisplay}
          games={["crossjig", "lexlet", "blobble", "wordfall", "logicGrid"]}
          repoName={"gribbles"}
          googleLink={
            "https://play.google.com/store/apps/details?id=gribbles.io.github.skedwards88.twa&hl=en_US"
          }
          includeExtraInfo={true}
          includeWordAttribution={true}
        ></MoreGames>
      );

    case "info":
      return <Rules timerDispatch={timerDispatch} setDisplay={setDisplay} />;

    case "game":
      return (
        <Game
          gameState={gameState}
          dispatchGameState={dispatchGameState}
          timerState={timerState}
          timerDispatch={timerDispatch}
          setDisplay={setDisplay}
          setInstallPromptEvent={setInstallPromptEvent}
          showInstallButton={showInstallButton}
          installPromptEvent={installPromptEvent}
        ></Game>
      );

    default:
      return (
        <TimerBlocker
          timerState={timerState}
          timerDispatch={timerDispatch}
          setDisplay={setDisplay}
        ></TimerBlocker>
      );
  }
}
