/*
	title: Add item to array
*/
////////// Slice with spread
const a = ["a", "b", "d", "e"];
const newItem = "c";
const index = 2;

const b = [...a.slice(0, index), newItem, ...a.slice(index)];
////////// Slice using concat
const a = ["a", "b", "d", "e"];
const newItem = "c";
const index = 2;

const b = a.slice(0, index).concat(newItem, a.slice(index));
////////// Splice
const a = ["a", "b", "d", "e"];
const newItem = "c";
const index = 2;

const b = [...a];
b.splice(index, 0, newItem);