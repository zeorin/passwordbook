const defaultRandom = () =>
	window.crypto.getRandomValues(new Uint32Array(1))[0] * 2 ** -32;

/** The maximum is exclusive and the minimum is inclusive */
const randomToRange = (min: number, max: number) => {
	const minCeiled = Math.ceil(min);
	const maxFloored = Math.floor(max);
	return (randomFloat: number) =>
		Math.floor(randomFloat * (maxFloored - minCeiled) + minCeiled);
};

const randomToDieFace = randomToRange(1, 7);

export const getDice =
	(random: () => number = defaultRandom) =>
	(dice = 5) =>
		parseInt(
			Array.from({ length: dice }, () =>
				String(randomToDieFace(random())),
			).join(""),
			10,
		);
