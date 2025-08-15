import isaac from "isaac";

import { capitalize } from "./capitalize";
import { getBits } from "./bits.ts";
import { getDice } from "./roll.ts";

import type { Wordlist } from "./wordlist";

export const getPassphraseGenerator =
	({ wordlist, roll }: { wordlist: Wordlist; roll: () => number }) =>
	(words = 6): string =>
		Array.from({ length: words }, () => capitalize(wordlist.get(roll())!)).join(
			"",
		);

export const generatePassphrases = async ({
	wordlist,
	seed,
}: {
	wordlist: Wordlist;
	seed: string;
}): Promise<string[]> => {
	const seedBits = await getBits(seed);
	isaac.seed(Array.from(new Uint32Array(seedBits)));
	const roll = getDice(() => isaac.random());
	const generatePassphrase = getPassphraseGenerator({ wordlist, roll });
	return Array.from({ length: 100 }, () => generatePassphrase());
};
