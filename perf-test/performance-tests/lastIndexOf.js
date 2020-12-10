/*
	title: IndexOf
*/
////////// indexOf
const a = "abcdefghijklmnopqrstuvwxyz";
const searched = "q"
const c = a.lastIndexOf(searched);
////////// match
const a = "abcdefghijklmnopqrstuvwxyz";
const searched = "q"
const key = `(${searched})`
const regexp = new RegExp(`${key}(?!.*${key})`)
const c = a.match(searched)?.index ?? -1;
