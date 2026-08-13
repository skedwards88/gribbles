import React from "react";
import {gameInit} from "../logic/gameInit";
import {gameReducer} from "../logic/gameReducer";
import Game from "./Game";
import Settings from "./Settings";
import Rules from "./Rules";
import MoreGames from "@skedwards88/shared-components/src/components/MoreGames";
import {TimerBlocker} from "./Timer";
import {useInstallPrompt} from "@skedwards88/shared-components/src/logic/handleInstall";
import InstallOverview from "@skedwards88/shared-components/src/components/InstallOverview";
import PWAInstall from "@skedwards88/shared-components/src/components/PWAInstall";
import {timerInit} from "../logic/timerInit";
import {timerReducer} from "../logic/timerReducer";
import {sendAnalyticsCF} from "@skedwards88/shared-components/src/logic/sendAnalyticsCF";
import {useMetadataContext} from "@skedwards88/shared-components/src/components/MetadataContextProvider";
import {inferEventsToLog} from "../logic/inferEventsToLog";

export type DisplayState =
  | "settings"
  | "heart"
  | "info"
  | "installOverview"
  | "pwaInstall"
  | "pause"
  | "game";

function parseURLQuery():
  | [string, number, number, boolean]
  | [undefined, undefined, undefined, undefined] {
  // Get the seed and game settings from the query params
  // Only the game settings that would affect the board are shared
  const searchParams = new URLSearchParams(document.location.search);
  const seedQuery = searchParams.get("puzzle");

  // The seed query consists of parts separated by an underscore
  if (seedQuery) {
    const [seed, gridSizeRaw, minWordLengthRaw, easyModeRaw] =
      seedQuery.split("_");
    const gridSize = parseInt(gridSizeRaw);
    const minWordLength = parseInt(minWordLengthRaw);
    const easyMode = easyModeRaw === "e";
    return [seed, gridSize, minWordLength, easyMode];
  } else {
    return [undefined, undefined, undefined, undefined];
  }
}

export default function App(): React.JSX.Element {
  const {userId, sessionId} = useMetadataContext();

  // This must live at the top level component, not in InstallOverview where it is used, since the InstallOverview is not rendered initially and therefore misses its chance to attach the listeners
  const {installPromptEvent, showInstallButton, handleInstall} =
    useInstallPrompt({userId, sessionId});

  const [seed, gridSize, minWordLength, easyMode] = parseURLQuery();

  const [display, setDisplay] = React.useState<DisplayState>("pause");

  const [gameState, dispatchGameState] = React.useReducer(
    gameReducer,
    {
      ...(seed && {seed}),
      ...(gridSize && {gridSize}),
      ...(minWordLength && {minWordLength}),
      ...(easyMode && {easyMode}),
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

  function handleVisibilityChange(): void {
    // Pause the timer if the page is hidden
    if (document.hidden && timerState.isRunning) {
      timerDispatch({action: "pause"});
      setDisplay("pause");
    }
  }

  React.useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return (): void =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  });

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
          googleAppLink={
            "https://play.google.com/store/apps/details?id=gribbles.io.github.skedwards88.twa&hl=en_US"
          }
          userId={userId}
          sessionId={sessionId}
          installPromptEvent={installPromptEvent}
          showInstallButton={showInstallButton}
          handleInstall={handleInstall}
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
          userId={userId}
          sessionId={sessionId}
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
