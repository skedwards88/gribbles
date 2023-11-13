import React from "react";
import packageJson from "../../package.json";

export default function Rules({setDisplay}) {
  return (
    <div className="App info">
      <h1>Gribbles: How to play</h1>
      <p className="infoText">{`TODO`}</p>
      <button
        onClick={() => {
          setDisplay("game");
        }}
      >
        {"Play"}
      </button>
      <small>version {packageJson.version}</small>
    </div>
  );
}
