import { html } from "../lib/html.js";

import { Loader } from "./Loader.js";
import { Generator } from "./Generator.js";
import { Passphrases } from "./Passphrases.js";

/** @import {State} from "../lib/state.js" */

/**
 * @param {State} props
 */
export const App = ({
	isGeneratingSeed,
	isGeneratingPassphrases,
	seed,
	generatedSeed,
	passphrases,
}) => html`
	<button id="print" disabled=${isGeneratingSeed || isGeneratingPassphrases}>
		Print
	</button>
	${isGeneratingSeed
		? html`<${Loader}>Generating seed phrase…</${Loader}>`
		: html`
				<${Generator}
					seed=${seed}
					showRegenerate=${seed && seed !== generatedSeed}
				/>
				${isGeneratingPassphrases
					? html`<${Loader}>Generating passwords…</${Loader}>`
					: html`<${Passphrases} passphrases=${passphrases} />`}
			`}
`;
