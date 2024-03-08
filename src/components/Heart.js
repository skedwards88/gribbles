import React from "react";
import {Share} from "./Share";
import packageJson from "../../package.json";

export default function Heart({setDisplay}) {
  const feedbackLink =
    "https://github.com/skedwards88/gribbles/issues/new/choose";

  return (
    <div className="App info">
      <h1>Gribbles</h1>
      <div className="infoText">
        {"Like this game? Share it with your friends.\n\n"}
        {<Share text={"Check out this jumbled word search game!"}></Share>}
        {`\n\n`}
        {<hr></hr>}
        {`\n`}
        {`Want more games? Check `}
        <a href="https://skedwards88.github.io/">these</a>
        {` out. `}
        {`\n\n`}
        {<hr></hr>}
        {`\n`}
        {"Feedback or ideas? "}
        <a href={feedbackLink}>Open an issue</a>
        {` on GitHub or email SECTgames@gmail.com.`}
        {`\n\n`}
        {<hr></hr>}
        {`\n`}
        {`Thanks to the word frequency data sources attributed in `}
        <a href="https://github.com/skedwards88/word_lists">
          skedwards88/word_lists
        </a>
        {`.`}
        {<hr></hr>}
        {`\n`}
        <a href="./privacy.html">Privacy policy</a>
        {`\n\n\n\n`}
        <small>version {packageJson.version}</small>
      </div>
      <button onClick={() => setDisplay("game")}>Close</button>
    </div>
  );
}
