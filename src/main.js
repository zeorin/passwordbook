import morphdom from "morphdom";

import { html } from "./html.js";
import { invariant } from "./invariant.js";
import { generatePassphrases } from "./passphrase.js";
import { generate as generateSeedPhrase } from "./seed.js";
import { createEffect, state } from "./state.js";

const container = document.getElementById("app");
invariant(container instanceof HTMLElement, "Could not find app container!");

/**
 * @param {object} [options={}]
 * @param {string} [options.language="en"]
 * @param {number} [options.count=100]
 * @param {number} [options.length=6]
 */
const generate = async ({ language = "en", count = 100, length = 6 } = {}) => {
	if (Object.keys(state).length > 0) {
		state.seed = undefined;
		state.passphrases = undefined;
	}

	const seed = await generateSeedPhrase(language);

	state.seed = seed;

	const passphrases = await generatePassphrases({
		language,
		seed,
		count,
		length,
	});

	state.passphrases = passphrases;
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
	const { seed } = state;

	if (seed == null) {
		return;
	}

	state.passphrases = undefined;

	state.passphrases = await generatePassphrases({
		language,
		seed,
		count,
		length,
	});
};

const render = () => {
	morphdom(
		container,
		[""]
			.concat(html`
				<div>
					<form id="generator" class="generator" action="#">
						<button id="generate" class="generate" type="button">
							Generate
						</button>
						<button id="regenerate" class="regenerate" type="button">
							Regenerate
						</button>
						<p
							id="seed"
							class="seed"
							autocomplete="off"
							spellcheck="false"
							contenteditable="plaintext-only"
						>
							${state.seed ?? ""}
						</p>
					</form>
					<ul id="passphrases" class="passphrases">
						${state.passphrases?.map(
							(passphrase) => html`<li>${passphrase}</li>`,
						) ?? ""}
					</ul>
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

	if (event.target.id === "generate") {
		generate();
		return;
	}

	if (event.target.id === "regenerate") {
		regenerate();
		return;
	}
});

createEffect(() => {
	render();
});

generate();
