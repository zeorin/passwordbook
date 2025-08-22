import { html } from "../html";

import { Loader } from "./loader.js";
import { Generator } from "./generator.js";
import { Passphrases } from "./passphrases.js";

/** @import {State} from "../state.js" */

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
	<button
		id="print"
		class="print"
		disabled=${isGeneratingSeed || isGeneratingPassphrases}
	>
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
