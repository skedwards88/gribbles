import React from "react";
import packageJson from "../../package.json";

export default function Rules({setDisplay, timerDispatch}) {
  return (
    <div className="App rules">
      <h1 id="rulesHeader">Gribbles: How to play</h1>
      <p id="rulesText">
        {
          "Swipe to connect letters into words. Can you find all the words before time is up?"
        }
      </p>
      <button
        id="rulesClose"
        className="close"
        onClick={() => {
          timerDispatch({action: "play"});
          setDisplay("game");
        }}
      >
        {"Play"}
      </button>
      <small id="rulesVersion">version {packageJson.version}</small>
    </div>
  );
}
