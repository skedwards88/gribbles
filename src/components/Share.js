import React from "react";
import sendAnalytics from "../logic/sendAnalytics";

function handleShare(text) {
  navigator
    .share({
      title: "Gribbles",
      text: `${text}\n\n`,
      url: "https://skedwards88.github.io/gribbles/",
    })
    .then(() => console.log("Successful share"))
    .catch((error) => {
      // copy to clipboard as backup
      handleCopy(text);
      console.log("Error sharing", error);
    });
  sendAnalytics("share");
}

function handleCopy(text) {
  try {
    navigator.clipboard.writeText(
      `${text}\n\nhttps://skedwards88.github.io/gribbles/`,
    );
  } catch (error) {
    console.log(error);
  }
}

export default function Share({text}) {
  if (navigator.canShare) {
    return <button onClick={() => handleShare(text)}>Share</button>;
  } else {
    return <button onClick={() => handleCopy(text)}>Copy sharing link</button>;
  }
}
