import { html } from "../lib/html";

/**
 * @param {number} length
 */
const spacer = (length) => Array.from({ length }, () => " ​"); // Non-breaking space + Zero Width Space

const labelSpacer = spacer(60);
const inputSpacer = spacer(80);

/**
 * @param {Object} props
 * @param {string} props.passphrase
 */
const Passphrase = ({ passphrase }) => html`
	<table class="passphrase">
		<tr>
			<td colspan="2" class="title spacer">${labelSpacer}</td>
		</tr>
		<tr>
			<th class="label">URL</th>
			<td class="spacer">${inputSpacer}</td>
		</tr>
		<tr>
			<th class="label">Login</th>
			<td class="spacer">${inputSpacer}</td>
		</tr>
		<tr>
			<th class="label">Password</th>
			<td>${passphrase}</td>
		</tr>
	</table>
`;

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * @param {string} alphabet
 * @param {string[]} passphrases
 */
const group = (alphabet, passphrases) => {
	const chunkSize = passphrases.length / alphabet.length;
	/** @type {[letter: string, passphrases: string[]][]} */
	const alphabetized = [];
	let offset = 0;
	for (let i = 0; i < alphabet.length; i++) {
		const round =
			offset - Math.round(chunkSize * i) <= 0 ? Math.ceil : Math.floor;
		const currentChunkSize = round(chunkSize);
		alphabetized.push([
			alphabet[i],
			passphrases.slice(offset, offset + currentChunkSize),
		]);
		offset += currentChunkSize;
	}
	return alphabetized;
};

/**
 * @param {Object} props
 * @param {string[]=} props.passphrases
 */
export const Passphrases = ({ passphrases }) =>
	passphrases == null || passphrases.length === 0
		? ""
		: html`
				<div class="passphrases">
					${group(alphabet, passphrases).map(
						([letter, passphrases]) => html`
							<h2 class="letter">${letter}</h2>
							${passphrases.map(
								(passphrase) =>
									html`<${Passphrase} passphrase=${passphrase} />`,
							)}
						`,
					)}
				</div>
			`;
