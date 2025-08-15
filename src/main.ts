import { invariant } from "./invariant.ts";
import { generatePassphrases } from "./passphrase.ts";
import { getSeedGenerator } from "./seed.ts";
import { loadWordlist } from "./wordlist.ts";

const loader = document.querySelector<HTMLDivElement>("div#loader");
invariant(loader);

const generator = document.querySelector<HTMLFormElement>("form#generator");
invariant(generator);
generator.addEventListener("submit", (event) => {
	event.preventDefault();
});

const generateButton =
	document.querySelector<HTMLButtonElement>("button#generate");
invariant(generateButton);

const seedInput = document.querySelector<HTMLParagraphElement>("p#seed");
invariant(seedInput);
seedInput.addEventListener("focus", () => {
	queueMicrotask(() => {
		seedInput.classList.add("focused");
	});
});
seedInput.addEventListener("blur", () => {
	seedInput.classList.remove("focused");
});

const regenerateButton =
	document.querySelector<HTMLButtonElement>("button#regenerate");
invariant(regenerateButton);

const passphraseList =
	document.querySelector<HTMLUListElement>("ul#passphrases");
invariant(passphraseList);

const wordlist = await loadWordlist();
const generateSeed = getSeedGenerator(wordlist);

const generate = async () => {
	const seed = generateSeed();
	seedInput.innerText = seed;
	passphraseList.innerHTML = "";
	const passphrases = await generatePassphrases({ wordlist, seed });
	passphraseList.innerHTML = passphrases
		.map((passphrase) => `<li>${passphrase}</li>`)
		.join("");
};

const regenerate = async () => {
	const seed = seedInput.innerText;
	passphraseList.innerHTML = "";
	const passphrases = await generatePassphrases({ wordlist, seed });
	passphraseList.innerHTML = passphrases
		.map((passphrase) => `<li>${passphrase}</li>`)
		.join("");
};

await generate();

generateButton.addEventListener("click", generate);
generateButton.innerHTML = "Generate";

regenerateButton.addEventListener("click", regenerate);
regenerateButton.innerHTML = "Regenerate";

generator.classList.remove("hidden");
loader.classList.add("hidden");
