/**
 * @typedef {() => void} Effect
 */

let queued = false;

/** @type {Effect | undefined} */
let currentEffect = undefined;

/** @type {Map<string | symbol, Effect[]>} */
const propEffects = new Map();

/** @type {Effect[]} */
const dirtyEffects = [];

const flush = () => {
	while (dirtyEffects.length) {
		dirtyEffects.shift()?.();
	}
};

/**
 * @param {Effect} effect
 */
export const createEffect = (effect) => {
	currentEffect = effect;
	effect();
	currentEffect = undefined;
};

/**
 * @param {string | symbol} prop
 */
const onGet = (prop) => {
	if (currentEffect) {
		let effects = propEffects.get(prop);
		if (!effects) {
			effects = [];
			propEffects.set(prop, effects);
		}
		effects.push(currentEffect);
	}
};

/**
 * @param {string | symbol} prop
 */
const onSet = (prop) => {
	const effects = propEffects.get(prop);
	if (!effects) {
		return;
	}

	for (const effect of effects) {
		dirtyEffects.push(effect);
	}

	if (!queued) {
		queued = true;
		queueMicrotask(() => {
			queued = false;
			flush();
		});
	}
};

/**
 * @typedef {Object} State
 * @property {boolean} isGeneratingSeed
 * @property {boolean} isGeneratingPassphrases
 * @property {string=} generatedSeed
 * @property {string=} seed
 * @property {string[]=} passphrases
 */

/** @type {State} */
const stateTarget = {
	isGeneratingSeed: false,
	isGeneratingPassphrases: false,
	generatedSeed: undefined,
	seed: undefined,
	passphrases: undefined,
};

/** @type {State} */
export const state = new Proxy(stateTarget, {
	get: (obj, prop) => {
		onGet(prop);
		// @ts-expect-error
		return obj[prop];
	},
	set: (obj, prop, value) => {
		// @ts-expect-error
		obj[prop] = value;
		onSet(prop);
		return true;
	},
});
