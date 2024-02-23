import React from "react";
import sendAnalytics from "../logic/sendAnalytics";

export function handleShare({text, seed}) {
  const url = "https://skedwards88.github.io/gribbles/";
  const fullUrl = seed ? `${url}?puzzle=${seed}` : url;

  if (navigator.canShare) {
    navigator
      .share({
        title: "Gribbles",
        text: `${text}\n\n`,
        url: fullUrl,
      })
      .then(() => console.log("Successful share"))
      .catch((error) => {
        console.log("Error sharing", error);
      });
  } else {
    handleCopy({text, fullUrl});
  }

  sendAnalytics("share");
}

function handleCopy({text, fullUrl}) {
  try {
    navigator.clipboard.writeText(`${text}\n\n${fullUrl}`);
  } catch (error) {
    console.log(error);
  }
}

export function Share({text, seed}) {
  return (
    <button onClick={() => handleShare({text, seed})}>
      {navigator.canShare ? "Share" : "Copy link to share"}
    </button>
  );
}
