import { getWordlist } from "./wordlist.ts";
import { mkGenerate } from "./generate.ts";

const generate = mkGenerate(await getWordlist());

const button = document.querySelector<HTMLButtonElement>("#password")!;

const setPassword = () => {
	button.innerHTML = generate();
};

button.addEventListener("click", setPassword);
button.removeAttribute("disabled");
setPassword();
