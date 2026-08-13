import PlayButtons from "@skedwards88/shared-components/src/components/PlayButtons";
import packageJson from "../../package.json";
import type {TimerReducerPayload} from "../logic/timerReducer";
import type {DisplayState} from "./App";

export default function Rules({
  setDisplay,
  timerDispatch,
}: {
  setDisplay: React.Dispatch<React.SetStateAction<DisplayState>>;
  timerDispatch: React.Dispatch<TimerReducerPayload>;
}): React.JSX.Element {
  return (
    <div className="App info">
      <h1>Gribbles</h1>
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
