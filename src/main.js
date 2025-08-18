import { invariant } from "./invariant.js";
import { generatePassphrases } from "./passphrase.js";
import { getSeedGenerator } from "./seed.js";
import { loadWordlist } from "./wordlist.js";

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
