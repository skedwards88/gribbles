import React from "react";

export default function Score({foundWordCount, bonusWordCount, maxWordCount}) {
  return (
    <div>
      <div>Left: {maxWordCount - foundWordCount + bonusWordCount}</div>
      {bonusWordCount !== null ? <div>Bonus: {bonusWordCount}</div> : <></>}
    </div>
  );
}
