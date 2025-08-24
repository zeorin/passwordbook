import { html } from "../lib/html";

/**
 * @param {Object} props
 * @param {string} props.passphrase
 */
const Passphrase = ({ passphrase }) => html`
	<table class="passphrase">
		<tr>
			<td colspan="2" class="title spacer"></td>
		</tr>
		<tr>
			<th class="label">URL</th>
			<td class="spacer"></td>
		</tr>
		<tr>
			<th class="label">Login</th>
			<td class="spacer"></td>
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
				<div class="passphrases" style="--sections: ${alphabet.length};">
					${group(alphabet, passphrases).map(
						([letter, passphrases]) => html`
							<section class="section" style="--passphrases: ${passphrases.length};">
								<div class="left-margin"></div>
  							<div class="content">
									<h2 class="heading letter">${letter}</h2>
									${passphrases.map(
										(passphrase) => html`
											<div class="gap"></div>
											<${Passphrase} passphrase=${passphrase} />
										`,
									)}
									<aside class="notes">
										<h3 class="heading">Notes</h2>
										<div class="gap"></div>
										<div class="lines">
											${passphrases.flatMap(() =>
												Array.from(
													{ length: 6 },
													() => html`<div class="line"></div>`,
												),
											)}
										</div>
									</aside>
  							</div>
								<div class="right-margin"></div>
							</section>
						`,
					)}
				</div>
			`;
