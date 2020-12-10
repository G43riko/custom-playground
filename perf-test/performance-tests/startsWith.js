/*
	title: startsWith
*/
////////// startsWith
const a = "abcdefghijklmnopqrstuvwxyz";
const searched = "abc"
const c = a.startsWith(searched);
////////// indexOf
const a = "abcdefghijklmnopqrstuvwxyz";
const searched = "abc"
const c = a.indexOf(searched) === 0;
////////// match
const a = "abcdefghijklmnopqrstuvwxyz";
const searched = "abc"
const c = !!a.match(new RegExp("^" + searched));
////////// substring
const a = "abcdefghijklmnopqrstuvwxyz";
const searched = "abc"
const c = searched === a.substring(0, searched.length);
////////// substr
const a = "abcdefghijklmnopqrstuvwxyz";
const searched = "abc"
const c = searched === a.substr(0, searched.length);
////////// forIn
const a = "abcdefghijklmnopqrstuvwxyz";
const searched = "abc"
const c = (() => {
    for (const i in searched) {
        if (searched[i] !== a[i]) {
            return false;
        }
    }
    return true;
})();
