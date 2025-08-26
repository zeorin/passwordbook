import { html } from "../lib/html";

import "./Passphrase.css";

/**
 * @param {Object} props
 * @param {string} props.passphrase
 */
export const Passphrase = ({ passphrase }) => html`
	<table class="passphrase">
		<tbody class="passphrase__body">
			<tr class="passphrase__row">
				<td
					colspan="2"
					class="passphrase__cell passphrase__cell--title passphrase__cell--spacer"
				></td>
			</tr>
			<tr class="passphrase__row">
				<th class="passphrase__cell passphrase__cell--label">URL</th>
				<td class="passphrase__cell passphrase__cell--spacer"></td>
			</tr>
			<tr class="passphrase__row">
				<th class="passphrase__cell passphrase__cell--label">Login</th>
				<td class="passphrase__cell passphrase__cell--spacer"></td>
			</tr>
			<tr class="passphrase__row">
				<th class="passphrase__cell passphrase__cell--label">Password</th>
				<td class="passphrase__cell">${passphrase}</td>
			</tr>
		</tbody>
	</table>
`;
