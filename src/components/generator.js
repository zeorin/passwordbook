import { html } from "../lib/html";

/**
 * @param {Object} props
 * @param {string=} props.seed
 * @param {boolean=} props.showRegenerate
 */
export const Generator = ({ seed }) => html`
	<form id="generator" class="generator" action="#">
		<label for="seed" class="label">Seed phrase</label>
		<p
			id="seed"
			class="seed"
			contenteditable="plaintext-only"
			spellcheck="false"
			writingsuggestions="false"
			autocapitalize="off"
			autocorrect="off"
			autocomplete="off"
			inputmode="text"
		>
			${seed ? `v1 ${seed}` : ""}
		</p>
	</form>
`;
