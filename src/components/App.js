import React from "react";
import {gameInit} from "../logic/gameInit";
import {gameReducer} from "../logic/gameReducer";
import Game from "./Game";
import Settings from "./Settings";
import Rules from "./Rules";
import Heart from "./Heart";
import {
  handleAppInstalled,
  handleBeforeInstallPrompt,
} from "../logic/handleInstall";

export default function App() {
  // Get the seed from the query params
  const searchParams = new URLSearchParams(document.location.search);
  const seed = searchParams.get("puzzle");

  const [display, setDisplay] = React.useState("pause");
  const [installPromptEvent, setInstallPromptEvent] = React.useState();
  const [showInstallButton, setShowInstallButton] = React.useState(true);

  const [gameState, dispatchGameState] = React.useReducer(
    gameReducer,
    {
      seed,
    },
    gameInit,
  );

  React.useEffect(() => {
    window.localStorage.setItem("gribblesGameState", JSON.stringify(gameState));
  }, [gameState]);

  React.useEffect(() => {
    window.addEventListener("beforeinstallprompt", (event) =>
      handleBeforeInstallPrompt(
        event,
        setInstallPromptEvent,
        setShowInstallButton,
      ),
    );
    return () =>
      window.removeEventListener("beforeinstallprompt", (event) =>
        handleBeforeInstallPrompt(
          event,
          setInstallPromptEvent,
          setShowInstallButton,
        ),
      );
  }, []);

  React.useEffect(() => {
    window.addEventListener("appinstalled", () =>
      handleAppInstalled(setInstallPromptEvent, setShowInstallButton),
    );
    return () => window.removeEventListener("appinstalled", handleAppInstalled);
  }, []);
  switch (display) {
    case "settings":
      return (
        <Settings
          setDisplay={setDisplay}
          dispatchGameState={dispatchGameState}
        />
      );

    case "heart":
      return <Heart setDisplay={setDisplay} />;

    case "info":
      return <Rules setDisplay={setDisplay} />;

    default:
      return (
        <Game
          gameState={gameState}
          dispatchGameState={dispatchGameState}
          setDisplay={setDisplay}
          setInstallPromptEvent={setInstallPromptEvent}
          showInstallButton={showInstallButton}
          installPromptEvent={installPromptEvent}
        ></Game>
      );
  }
}
