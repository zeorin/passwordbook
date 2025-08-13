export const roll = (dice = 5) =>
	parseInt(
		Array.from({ length: dice }, () =>
			String((window.crypto.getRandomValues(new Uint32Array(1))[0] % 6) + 1),
		).join(""),
		10,
	);
