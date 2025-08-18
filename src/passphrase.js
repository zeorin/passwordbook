import isaac from "isaac";

import { capitalize } from "./capitalize.js";
import { getBits } from "./bits.js";
import { getDice } from "./roll.js";

/** @import {Wordlist} from "./wordlist.js" */

/**
 * @param {Object} options
 * @param {Wordlist} options.wordlist
 * @param {() => number} options.roll
 */
export const getPassphraseGenerator =
	({ wordlist, roll }) =>
	/**
	 * @param {number} [words=6]
	 * @returns {string}
	 */
	(words = 6) =>
		Array.from({ length: words }, () =>
			capitalize(wordlist.get(roll()) ?? ""),
		).join("");

/**
 * @param {Object} options
 * @param {Wordlist} options.wordlist
 * @param {string} options.seed
 * @returns {Promise<string[]>}
 */
export const generatePassphrases = async ({ wordlist, seed }) => {
	const seedBits = await getBits(seed);
	isaac.seed(Array.from(new Uint32Array(seedBits)));
	const roll = getDice(() => isaac.random());
	const generatePassphrase = getPassphraseGenerator({ wordlist, roll });
	return Array.from({ length: 100 }, () => generatePassphrase());
};
