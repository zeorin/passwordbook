import { html } from "../lib/html";

import "./Loader.css";

/**
 * @param {Object} props
 * @param {string[]} props.children
 */
export const Loader = ({ children }) => html`
	<p class="loader">${children}</p>
`;
