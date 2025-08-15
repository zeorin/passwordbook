import { getPassphraseGenerator } from "./passphrase";
import { getDice } from "./roll";
import type { Wordlist } from "./wordlist";

export const getSeedGenerator = (wordlist: Wordlist) =>
	getPassphraseGenerator({ wordlist, roll: getDice() });
