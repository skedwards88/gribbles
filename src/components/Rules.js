import React from "react";
import packageJson from "../../package.json";

export default function Rules({setDisplay, timerDispatch}) {
  return (
    <div className="App info">
      <h1>Gribbles: How to play</h1>
      <p className="infoText">
        {`Swipe to connect letters into words.\n\nCan you find all the words before time is up?\n\nChange the settings to control how much time you start with and how much time you get for each word that you find.\n\nIn easy mode, get a bonus point for less common words.`}
      </p>
      <button
        onClick={() => {
          timerDispatch({action: "play"});
          setDisplay("game");
        }}
      >
        {"Play"}
      </button>
      <small>version {packageJson.version}</small>
    </div>
  );
}
