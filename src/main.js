import morphdom from "morphdom";

import { html } from "./html.js";
import { invariant } from "./invariant.js";
import { generatePassphrases } from "./passphrase.js";
import {
	generate as generateSeedPhrase,
	validate as validateSeed,
} from "./seed.js";
import { createEffect, state } from "./state.js";
import { App } from "./components/app.js";

const container = document.getElementById("app");
invariant(container instanceof HTMLElement, "Could not find app container!");

/**
 * @param {object} [options={}]
 * @param {string} [options.language="en"]
 * @param {number} [options.count=100]
 * @param {number} [options.length=6]
 */
const generate = async ({ language = "en", count = 100, length = 6 } = {}) => {
	state.isGeneratingSeed = true;
	state.isGeneratingPassphrases = true;

	const seed = await generateSeedPhrase(language);

	state.seed = seed;
	state.generatedSeed = seed;
	state.isGeneratingSeed = false;

	state.passphrases = await generatePassphrases({
		language,
		seed,
		count,
		length,
	});

	state.isGeneratingPassphrases = false;
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
	const { seed, generatedSeed } = state;

	if (seed == null || seed === generatedSeed || !validateSeed(seed)) {
		return;
	}

	state.isGeneratingPassphrases = true;
	state.passphrases = undefined;

	state.passphrases = await generatePassphrases({
		language,
		seed,
		count,
		length,
	});
	state.isGeneratingPassphrases = false;
};

const render = () => {
	morphdom(
		container,
		[""]
			.concat(html`
				<div>
					<${App} ...${state} />
				</div>
			`)
			.join(""),
		{
			childrenOnly: true,
			onBeforeElUpdated: (fromEl, toEl) => !fromEl.isEqualNode(toEl),
		},
	);
};

container.addEventListener("click", (event) => {
	if (!(event.target instanceof HTMLButtonElement)) {
		return;
	}

	if (event.target.id === "print") {
		window.print();
	}
});

container.addEventListener("input", (event) => {
	if (!(event.target instanceof HTMLElement)) {
		return;
	}

	if (event.target.id === "seed") {
		state.seed = event.target.textContent ?? undefined;
		regenerate();
	}
});

// Strip zero-width spaces on copy
document.addEventListener("copy", (event) => {
	const selection = window.getSelection();
	if (selection && event.clipboardData) {
		event.clipboardData.setData(
			"text/plain",
			selection?.toString().replaceAll("​", ""),
		);
		event.preventDefault();
	}
});

createEffect(() => {
	render();
});

generate();
