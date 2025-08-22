import React from "react";
import PlayButtons from "@skedwards88/shared-components/src/components/PlayButtons";
import packageJson from "../../package.json";

export default function Rules({setDisplay, timerDispatch}) {
  return (
    <div className="App info">
      <h1>Gribbles: How to play</h1>
      <div className="infoText">
        <p>Swipe to connect letters into words.</p>
        <p>Can you find all the words before time is up?</p>
        <p>
          Change the settings to control how much time you start with and how
          much time you get for each word that you find.
        </p>
        <p>In easy mode, get a bonus point for less common words.</p>
      </div>
      <PlayButtons
        onClickPlay={() => {
          timerDispatch({action: "play"});
          setDisplay("game");
        }}
        onClickInstall={() => setDisplay("installOverview")}
      ></PlayButtons>
      <small>version {packageJson.version}</small>
    </div>
  );
}
