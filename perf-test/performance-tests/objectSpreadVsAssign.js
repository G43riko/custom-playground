/*
	title: Object destructure vs assign
*/
////////// Destruct
const a = {
    hello: "world",
    world: "hello"
};

const b = {...a, right: "wrong", wrong: "right"};
////////// Object.assign
const a = {
    hello: "world",
    world: "hello"
};

const b = Object.assign({}, a, {right: "wrong", wrong: "right"});
