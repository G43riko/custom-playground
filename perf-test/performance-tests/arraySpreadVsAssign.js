/*
	title: Array spread operator vs Object.assign
*/
////////// Spread
const a = ["a", "b", "c"];
const b = [...a];
////////// Assign
const a = ["a", "b", "c"];
const b = Object.assign([], a);