const defaultRandom = () =>
	window.crypto.getRandomValues(new Uint32Array(1))[0] * 2 ** -32;

/**
 * The maximum is exclusive and the minimum is inclusive
 *
 * @param {number} min
 * @param {number} max
 */
const randomToRange = (min, max) => {
	const minCeiled = Math.ceil(min);
	const maxFloored = Math.floor(max);

	/**
	 * @param {number} randomFloat
	 * @returns {number}
	 */
	return (randomFloat) =>
		Math.floor(randomFloat * (maxFloored - minCeiled) + minCeiled);
};

const randomToDieFace = randomToRange(1, 7);

/**
 * @param {(() => number)=} random
 */
export const getDice =
	(random = defaultRandom) =>
	/**
	 * @param {number} [dice=5]
	 * @returns {number}
	 */
	(dice = 5) =>
		parseInt(
			Array.from({ length: dice }, () =>
				String(randomToDieFace(random())),
			).join(""),
			10,
		);
