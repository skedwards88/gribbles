import React from "react";
import packageJson from "../../package.json";

export default function Rules({setDisplay, timerDispatch}) {
  return (
    <div className="App info">
      <h1>Gribbles: How to play</h1>
      <p className="infoText">
        {
          "Swipe to connect letters into words. Can you find all the words before time is up?"
        }
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
