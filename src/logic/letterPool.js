import {getLetterPool} from "@skedwards88/word_logic";
import {
  commonWordsLen3,
  commonWordsLen4,
  commonWordsLen5,
  commonWordsLen6,
  commonWordsLen7,
} from "@skedwards88/word_lists";

// Just using the shorter common words since this is what people tend to find
export const letterPool = getLetterPool([
  ...commonWordsLen3,
  ...commonWordsLen4,
  ...commonWordsLen5,
  ...commonWordsLen6,
  ...commonWordsLen7,
]);
