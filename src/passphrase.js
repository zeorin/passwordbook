import isaac from "isaac";

import { capitalize } from "./capitalize.js";
import { invariant } from "./invariant.js";
import { getBits, validate as validateSeed } from "./seed.js";
import { loadWordlist } from "./wordlist.js";

/**
 * @param {Object} options
 * @param {string} [options.language="en"]
 * @param {string} options.seed
 * @param {number} [options.count=100]
 * @param {number} [options.length=6]
 * @returns {Promise<string[]>}
 */
export const generatePassphrases = async ({
	language = "en",
	seed,
	count = 100,
	length = 6,
}) => {
	const [words, isValidSeed] = await Promise.all([
		loadWordlist(language),
		validateSeed(seed, language),
	]);

	invariant(isValidSeed, "Invalid seed phrase!");

	isaac.seed(Array.from(new Uint32Array(await getBits(seed))));

	return Array.from({ length: count }, () =>
		Array.from(
			{ length },
			() => words[Math.floor(isaac.random() * words.length)],
		)
			.map(capitalize)
			.join(""),
	);
};
