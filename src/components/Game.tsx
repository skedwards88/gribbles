import ControlBar from "./ControlBar";
import {Timer} from "./Timer";
import Score from "./Score";
import Board from "./Board";
import {WordResult} from "./WordResult";
import {FoundWords, AllWords} from "./FoundWords";
import type {GameReducerPayload} from "../logic/gameReducer";
import type {DisplayState} from "./App";
import type {GameState} from "../logic/gameInit";
import type {TimerState} from "../logic/timerInit";
import type {TimerReducerPayload} from "../logic/timerReducer";

export default function Game({
  gameState,
  dispatchGameState,
  timerState,
  timerDispatch,
  setDisplay,
}: {
  gameState: GameState;
  dispatchGameState: React.Dispatch<GameReducerPayload>;
  timerState: TimerState;
  timerDispatch: React.Dispatch<TimerReducerPayload>;
  setDisplay: React.Dispatch<React.SetStateAction<DisplayState>>;
}): React.JSX.Element {
  return (
    <div
      className="App"
      id="gribbles"
      onPointerUp={(event) => {
        event.preventDefault();

        dispatchGameState({
          action: "endWord",
        });
      }}
    >
      <ControlBar
        gameState={gameState}
        dispatchGameState={dispatchGameState}
        setDisplay={setDisplay}
        timerState={timerState}
        timerDispatch={timerDispatch}
      ></ControlBar>

      <div id="stats">
        <Timer timerState={timerState} timerDispatch={timerDispatch} />
        <Score
          foundWordCount={gameState.foundWords.length}
          bonusWordCount={gameState.easyMode ? gameState.bonusWordCount : null}
          maxWordCount={gameState.allWords.length}
        ></Score>
      </div>

      {timerState.remainingTime > 0 ? (
        <FoundWords foundWords={gameState.foundWords} />
      ) : (
        <AllWords
          foundWords={gameState.foundWords}
          allWords={gameState.allWords}
        />
      )}

      <div id="currentWord">
        {gameState.playedIndexes.length > 0
          ? gameState.playedIndexes
              .map((index) => gameState.letters[index])
              .join("")
          : " "}
      </div>

      <WordResult result={gameState.result} />

      <Board
        letters={gameState.letters}
        playedIndexes={gameState.playedIndexes}
        gameOver={timerState.remainingTime <= 0}
        dispatchGameState={dispatchGameState}
      ></Board>
    </div>
  );
}
