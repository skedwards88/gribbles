import React from "react";
import sendAnalytics from "../logic/sendAnalytics";

function handleShare({text, fullUrl}) {
  navigator
    .share({
      title: "Gribbles",
      text: `${text}\n\n`,
      url: fullUrl,
    })
    .then(() => console.log("Successful share"))
    .catch((error) => {
      // copy to clipboard as backup
      handleCopy(text);
      console.log("Error sharing", error);
    });
  sendAnalytics("share");
}

function handleCopy({text, fullUrl}) {
  try {
    navigator.clipboard.writeText(`${text}\n\n${fullUrl}`);
  } catch (error) {
    console.log(error);
  }
}

export default function Share({text, seed, compact = false}) {
  const url = "https://skedwards88.github.io/gribbles/";
  const fullUrl = seed ? `${url}?puzzle=${seed}` : url;

  return (
    <button
      id={compact ? "shareButton" : ""}
      onClick={() =>
        navigator.canShare
          ? handleShare({text, fullUrl})
          : handleCopy({text, fullUrl})
      }
    >
      {compact ? "" : navigator.canShare ? "Share" : "Copy link to share"}
    </button>
  );
}
