import React from "react";

export function WordResult({result}) {
  return result == "" ? (
    <></>
  ) : (
    <div id="wordResult" className="fadeOut">
      {result}
    </div>
  );
}
