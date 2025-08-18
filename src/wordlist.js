const newline = /\r?\n/gu;

/**
 * @param {ReadableStreamDefaultReader<string>} reader
 * @returns {AsyncGenerator<string, void, unknown>}
 */
const readLine = async function* (reader) {
	let { value: chunk = "", done: readerDone } = await reader.read();

	let startIndex = 0;

	while (true) {
		const result = newline.exec(chunk);
		if (!result) {
			if (readerDone) break;
			const remainder = chunk.slice(startIndex);
			({ value: chunk = "", done: readerDone } = await reader.read());
			chunk = remainder + chunk;
			startIndex = newline.lastIndex = 0;
			continue;
		}
		yield chunk.substring(startIndex, result.index);
		startIndex = newline.lastIndex;
	}

	if (startIndex < chunk.length) {
		// Last line didn't end in a newline char
		yield chunk.substring(startIndex);
	}
};

/** @typedef {Map<number, string>} Wordlist */

/**
 * @returns {Promise<Wordlist>}
 */
export const loadWordlist = async () => {
	const response = await fetch("/eff_large_wordlist.txt");

	if (!response.ok) {
		throw new Error(`${response.status}: ${response.statusText}`);
	}

	if (response.body == null) {
		throw new Error("No response");
	}

	/** @type {Wordlist} */
	const wordlist = new Map();

	for await (const line of readLine(
		response.body.pipeThrough(new TextDecoderStream()).getReader(),
	)) {
		const [number, word] = line.split("\t");

		wordlist.set(parseInt(number, 10), word);
	}

	return wordlist;
};
