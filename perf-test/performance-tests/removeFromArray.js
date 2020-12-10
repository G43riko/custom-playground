/*
	title: Remove item from array
*/
////////// Splice
const a = ["a", "b", "c", "d", "e"];
const indexToRemove = 2;

const b = a.splice(indexToRemove, 1);
////////// Slice using sprea
const a = ["a", "b", "c", "d", "e"];
const indexToRemove = 2;

const b = [...a.slice(0, indexToRemove), ...a.slice(indexToRemove + 1)];
////////// Splice using concat
const a = ["a", "b", "c", "d", "e"];
const indexToRemove = 2;

const b = a.slice(0, indexToRemove).concat(a.slice(indexToRemove + 1));
////////// Filter
const a = ["a", "b", "c", "d", "e"];
const indexToRemove = 2;
const b = a.filter((_, i) => i !== indexToRemove)
