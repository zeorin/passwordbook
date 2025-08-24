// Adapted from https://github.com/alexreardon/tiny-invariant

const prefix = "Invariant failed";

/**
 * `invariant` is used to [assert](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions) that the `condition` is [truthy](https://github.com/getify/You-Dont-Know-JS/blob/bdbe570600d4e1107d0b131787903ca1c9ec8140/up%20%26%20going/ch2.md#truthy--falsy).
 *
 * 💥 `invariant` will `throw` an `Error` if the `condition` is [falsey](https://github.com/getify/You-Dont-Know-JS/blob/bdbe570600d4e1107d0b131787903ca1c9ec8140/up%20%26%20going/ch2.md#truthy--falsy)
 *
 * @param {any} condition
 * @param {(string|(() => string))=} message - Can provide a string, or a function that returns a string for cases where the message takes a fair amount of effort to compute
 *
 * @return {asserts condition}
 *
 * @example
 *
 * ```ts
 * const value: Person | null = { name: 'Alex' };
 * invariant(value, 'Expected value to be a person');
 * // type of `value`` has been narrowed to `Person`
 * ```
 */
export function invariant(condition, message) {
	if (condition) {
		return;
	}
	// Condition not passed

	/** @type {string | undefined} */
	const provided = typeof message === "function" ? message() : message;

	// Options:
	// 1. message provided: `${prefix}: ${provided}`
	// 2. message not provided: prefix
	/** @type {string} */
	const value = provided ? `${prefix}: ${provided}` : prefix;
	throw new Error(value);
}
