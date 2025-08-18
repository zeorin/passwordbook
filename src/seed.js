import { getPassphraseGenerator } from "./passphrase.js";
import { getDice } from "./roll.js";

/** @import {Wordlist} from "./wordlist.js" */

/**
 * @param {Wordlist} wordlist
 */
export const getSeedGenerator = (wordlist) =>
	getPassphraseGenerator({ wordlist, roll: getDice() });
