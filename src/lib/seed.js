import * as bip39 from "@scure/bip39";

/**
 * @param {string} [language="en"]
 * @returns {Promise<string[]>}
 */
const loadWordlist = (language = "en") =>
	(
		({
			cz: () => import("@scure/bip39/wordlists/czech"),
			en: () => import("@scure/bip39/wordlists/english"),
			fr: () => import("@scure/bip39/wordlists/french"),
			it: () => import("@scure/bip39/wordlists/italian"),
			jp: () => import("@scure/bip39/wordlists/japanese"),
			ko: () => import("@scure/bip39/wordlists/portuguese"),
			zh: () => import("@scure/bip39/wordlists/simplified-chinese"),
			sp: () => import("@scure/bip39/wordlists/spanish"),
			zh_TW: () => import("@scure/bip39/wordlists/traditional-chinese"),
		})[language] ?? (() => import("@scure/bip39/wordlists/english"))
	)().then(({ wordlist }) => wordlist);

/**
 * @param {string} [language="en"]
 * @param {number} [strength=256]
 * @returns {Promise<string>}
 */
export const generate = async (language = "en", strength = 256) =>
	bip39.generateMnemonic(await loadWordlist(language), strength);

/**
 * @param {string} seedPhrase
 * @param {string} [language="en"]
 * @returns {Promise<boolean>}
 */
export const validate = async (seedPhrase, language = "en") =>
	bip39.validateMnemonic(seedPhrase, await loadWordlist(language));

/**
 * @param {string} str
 */
const normalize = (str) => {
	const norm = str.normalize("NFKD");
	const words = norm.split(" ");
	if (![12, 15, 18, 21, 24].includes(words.length))
		throw new Error("Invalid mnemonic");
	return norm;
};

/** @type {Pbkdf2Params} */
const pdkdf2opts = {
	name: "PBKDF2",
	salt: Uint8Array.from(
		atob(
			"0MhNAbIiJFD8W+swbBRlxh1Ig+NBiI/hsSH5lEK63Wl1wI9viBzhkbHO7lHOF9C7JKElyD9Yxw1tyfg88ZKswdgvjtap+leRaO7bsxrv+Kf7QT/lOW0pEzPapvefexpecQq/iXfbnJkepyS7ODgKPK+N/ZN4+TLEjJz38IMBgIM=",
		),
		(c) => c.charCodeAt(0),
	),
	iterations: 2 ** 18,
	hash: "SHA-512",
};

/**
 * @param {string} seedPhrase
 * @param {number} [length=256]
 * @returns {Promise<Uint8Array>}
 */
export const getBits = async (seedPhrase, length = 256 * 8) =>
	new Uint8Array(
		await window.crypto.subtle.deriveBits(
			pdkdf2opts,
			await window.crypto.subtle.importKey(
				"raw",
				new Uint8Array(new TextEncoder().encode(normalize(seedPhrase))),
				"PBKDF2",
				false,
				["deriveBits"],
			),
			length,
		),
	);
