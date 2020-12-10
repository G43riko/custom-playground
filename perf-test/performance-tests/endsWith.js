/*
	title: endsWith
*/
////////// endsWith
const a = "abcdefghijklmnopqrstuvwxyz";
const searched = "xyz"
const c = a.endsWith(searched);
////////// indexOf
const a = "abcdefghijklmnopqrstuvwxyz";
const searched = "xyz"
const c = a.indexOf(searched) === a.length - searched.length;
////////// match
const a = "abcdefghijklmnopqrstuvwxyz";
const searched = "xyz"
const c = !!a.match(new RegExp(searched + "$"));
////////// substring
const a = "abcdefghijklmnopqrstuvwxyz";
const searched = "xyz"
const c = searched === a.substring(a.length - searched.length);
////////// substr
const a = "abcdefghijklmnopqrstuvwxyz";
const searched = "xyz"
const c = searched === a.substr(-searched.length);
