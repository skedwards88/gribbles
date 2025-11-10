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
} from "@skedwards88/shared-components/src/logic/handleInstall";
import InstallOverview from "@skedwards88/shared-components/src/components/InstallOverview";
import PWAInstall from "@skedwards88/shared-components/src/components/PWAInstall";
import {timerInit} from "../logic/timerInit";
import {timerReducer} from "../logic/timerReducer";
import {sendAnalyticsCF} from "@skedwards88/shared-components/src/logic/sendAnalyticsCF";
import {useMetadataContext} from "@skedwards88/shared-components/src/components/MetadataContextProvider";
import {inferEventsToLog} from "../logic/inferEventsToLog";

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
  // *****
  // Install handling setup
  // *****
  // Set up states that will be used by the handleAppInstalled and handleBeforeInstallPrompt listeners
  const [installPromptEvent, setInstallPromptEvent] = React.useState();
  const [showInstallButton, setShowInstallButton] = React.useState(true);

  React.useEffect(() => {
    // Need to store the function in a variable so that
    // the add and remove actions can reference the same function
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
    // Need to store the function in a variable so that
    // the add and remove actions can reference the same function
    const listener = () =>
      handleAppInstalled(setInstallPromptEvent, setShowInstallButton);

    window.addEventListener("appinstalled", listener);

    return () => window.removeEventListener("appinstalled", listener);
  }, []);
  // *****
  // End install handling setup
  // *****

  const [seed, gridSize, minWordLength, easyMode] = parseURLQuery();

  const [display, setDisplay] = React.useState("pause");

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

  const {userId, sessionId} = useMetadataContext();

  // Store the previous state so that we can infer which analytics events to send
  const previousStateRef = React.useRef(gameState);

  // Send analytics following reducer updates, if needed
  React.useEffect(() => {
    const previousState = previousStateRef.current;

    const analyticsToLog = inferEventsToLog(previousState, gameState);

    if (analyticsToLog.length) {
      sendAnalyticsCF({userId, sessionId, analyticsToLog});
    }

    previousStateRef.current = gameState;
  }, [gameState, sessionId, userId]);

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

    case "installOverview":
      return (
        <InstallOverview
          setDisplay={setDisplay}
          setInstallPromptEvent={setInstallPromptEvent}
          showInstallButton={showInstallButton}
          installPromptEvent={installPromptEvent}
          googleAppLink={
            "https://play.google.com/store/apps/details?id=gribbles.io.github.skedwards88.twa&hl=en_US"
          }
          userId={userId}
          sessionId={sessionId}
        ></InstallOverview>
      );

    case "pwaInstall":
      return (
        <PWAInstall
          setDisplay={setDisplay}
          googleAppLink={
            "https://play.google.com/store/apps/details?id=gribbles.io.github.skedwards88.twa&hl=en_US"
          }
          pwaLink={"https://skedwards88.github.io/gribbles"}
        ></PWAInstall>
      );

    case "game":
      return (
        <Game
          gameState={gameState}
          dispatchGameState={dispatchGameState}
          timerState={timerState}
          timerDispatch={timerDispatch}
          setDisplay={setDisplay}
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
