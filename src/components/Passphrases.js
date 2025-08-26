import { html } from "../lib/html";
import { Passphrase } from "./Passphrase";

import "./Passphrases.css";

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
				<div class="passphrases" style="--sections: ${alphabet.length};">
					${group(alphabet, passphrases).map(
						([letter, passphrases]) => html`
							<section style="--passphrases: ${passphrases.length}; --section: '${letter}';">
								<h2>${letter}</h2>
								<div class="tables">
									${passphrases.map(
										(passphrase) => html`
											<${Passphrase} passphrase=${passphrase} />
										`,
									)}
								</div>
								<aside>
									<h3>Notes</h2>
									<div class="notes">
										<div class="lines">
											${passphrases.flatMap(() => Array.from({ length: 6 }, () => html`<div></div>`))}
										</div>
									</div>
								</aside>
							</section>
						`,
					)}
				</div>
			`;
