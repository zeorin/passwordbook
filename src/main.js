import { invariant } from "./invariant.js";
import { generatePassphrases } from "./passphrase.js";
import { generate as generateSeedPhrase } from "./seed.js";

const loader = document.querySelector("#loader");
invariant(loader && loader instanceof HTMLDivElement);

const generator = document.querySelector("#generator");
invariant(generator && generator instanceof HTMLFormElement);
generator.addEventListener("submit", (event) => {
	event.preventDefault();
});

const generateButton = document.querySelector("#generate");
invariant(generateButton && generateButton instanceof HTMLButtonElement);

const seedInput = document.querySelector("#seed");
invariant(seedInput && seedInput instanceof HTMLParagraphElement);
seedInput.addEventListener("focus", () => {
	queueMicrotask(() => {
		seedInput.classList.add("focused");
	});
});
seedInput.addEventListener("blur", () => {
	seedInput.classList.remove("focused");
});

const regenerateButton = document.querySelector("#regenerate");
invariant(regenerateButton && regenerateButton instanceof HTMLButtonElement);

const passphraseList = document.querySelector("#passphrases");
invariant(passphraseList && passphraseList instanceof HTMLUListElement);

/** @param {string[]} passphrases */
const renderPassphrases = (passphrases) => {
	passphraseList.innerHTML = passphrases
		.map((passphrase) => `<li>${passphrase}</li>`)
		.join("");
};

/**
 * @param {object} [options={}]
 * @param {string} [options.language="en"]
 * @param {number} [options.count=100]
 * @param {number} [options.length=6]
 */
const generate = async ({ language = "en", count = 100, length = 6 } = {}) => {
	seedInput.innerText = "";
	renderPassphrases([]);

	const seed = await generateSeedPhrase(language);
	seedInput.innerText = seed;

	renderPassphrases(
		await generatePassphrases({
			language,
			seed,
			count,
			length,
		}),
	);
};

/**
 * @param {object} [options={}]
 * @param {string} [options.language="en"]
 * @param {number} [options.count=100]
 * @param {number} [options.length=6]
 */
const regenerate = async ({
	language = "en",
	count = 100,
	length = 6,
} = {}) => {
	const seed = seedInput.innerText;

	renderPassphrases([]);

	renderPassphrases(
		await generatePassphrases({
			language,
			seed,
			count,
			length,
		}),
	);
};

await generate();

generateButton.addEventListener("click", () => generate());
generateButton.innerHTML = "Generate";

regenerateButton.addEventListener("click", () => regenerate());
regenerateButton.innerHTML = "Regenerate";

generator.classList.remove("hidden");
loader.classList.add("hidden");
