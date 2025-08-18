const SALT =
	"0MhNAbIiJFD8W+swbBRlxh1Ig+NBiI/hsSH5lEK63Wl1wI9viBzhkbHO7lHOF9C7JKElyD9Yxw1tyfg88ZKswdgvjtap+leRaO7bsxrv+Kf7QT/lOW0pEzPapvefexpecQq/iXfbnJkepyS7ODgKPK+N/ZN4+TLEjJz38IMBgIM=";

const textEncoder = new TextEncoder();

const encodedSalt = Uint8Array.from(atob(SALT), (c) => c.charCodeAt(0));

/**
 * @param {string} password
 * @returns {Promise<ArrayBuffer>}
 */
export const getBits = async (password) => {
	const encoded = textEncoder.encode(password);
	const key = await window.crypto.subtle.importKey(
		"raw",
		encoded,
		{ name: "PBKDF2" },
		false,
		["deriveBits"],
	);
	return window.crypto.subtle.deriveBits(
		{
			name: "PBKDF2",
			hash: { name: "SHA-256" },
			iterations: 600_000,
			salt: encodedSalt,
		},
		key,
		256 * 8,
	);
};
