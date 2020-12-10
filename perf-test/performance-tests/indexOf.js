/*
	title: IndexOf
*/
////////// indexOf
const a = "abcdefghijklmnopqrstuvwxyz";
const searched = "q"
const c = a.indexOf(searched);
////////// match
const a = "abcdefghijklmnopqrstuvwxyz";
const searched = "q"
const c = a.match(searched)?.index ?? -1;
