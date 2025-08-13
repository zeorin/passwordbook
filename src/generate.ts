import { capitalize } from "./capitalize";
import { roll } from "./roll";
import type { Wordlist } from "./wordlist";

export const mkGenerate =
	(wordlist: Wordlist) =>
	(words = 6): string =>
		Array.from({ length: words }, () => capitalize(wordlist.get(roll())!)).join(
			"",
		);
