import {getTrie} from "@skedwards88/word_logic";
import {commonWords, uncommonWords} from "@skedwards88/word_lists";

export const trie = getTrie([...commonWords], [...uncommonWords]);
