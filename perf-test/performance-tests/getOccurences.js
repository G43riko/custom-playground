/*
	title: Get subscring occurences
*/

////////// Regexp
function occurrencesV1(text, key) {
    return (text.match(new RegExp(key, "g")) || []).length;
}

const a = occurrencesV1("I am the most expensive and the best IDE on the world", "the");

////////// IndexOf
function occurrencesV2(text, key) {
    let index = text.indexOf(key);
    let counter = 0;
    while (index >= 0) {
        counter++;
        index = text.indexOf(key, index + key.length);
    }
    return counter;
}

const a = occurrencesV2("I am the most expensive and the best IDE on the world", "the");
