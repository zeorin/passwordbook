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
 * @param {number} [options.count=256]
 * @param {number} [options.length=6]
 * @param {string=} options.seed
 */
const generate = async ({
	language = "en",
	count = 256,
	length = 6,
	seed,
} = {}) => {
	state.isGeneratingPassphrases = true;

	if (!seed) {
		state.isGeneratingSeed = true;
		seed = await generateSeedPhrase(language);
		state.generatedSeed = seed;
		state.seed = seed;
		state.isGeneratingSeed = false;
	}

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

container.addEventListener("input", async (event) => {
	if (!(event.target instanceof HTMLElement)) {
		return;
	}

	if (event.target.id === "seed") {
		const seed = event.target.textContent?.replace("v1 ", "");
		state.seed = seed;
		if (seed && seed !== state.generatedSeed && (await validateSeed(seed))) {
			generate({ seed });
		}
		return;
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
