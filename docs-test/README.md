## Usage

```typescript
/*******************************************
 *
 ******************************************/

/**
 * @example
 *  pass("gabriel) => gabriel
 *  pass("gabriel") => "gabriel"
 *  pass("23") => "23"
 *  pass(23) => 23
 */
function pass <T>(param: T): T {
    return param
}

////////////////////////////////////////////

expect(pass("gabriel")).to.be.equal("gabriel");
expect(pass("gabriel")).to.be.equal("gabriel");
expect(pass("23")).to.be.equal("23");
expect(pass(23)).to.be.equal(23);

/*******************************************
 * 
 ******************************************/

/**
 * @example
 *  pass(true) => true
 *  pass(false) => false
 *  pass(NaN) => NaN
 *  pass(null) => null
 *  pass(undefined) => undefined
 *  pass([]) => []
 *  pass({}) => {}
 */
function pass <T>(param: T): T {
    return param
}

////////////////////////////////////////////

expect(pass(true)).to.be.true;
expect(pass(false)).to.be.false;
expect(pass(NaN)).to.be.NaN;
expect(pass(null)).to.be.null;
expect(pass(undefined)).to.be.undefined;
expect(pass([])).to.be.equal([]);
expect(pass({})).to.be.equal({});

/*******************************************
 *
 ******************************************/

/**
 * @example
 *  pass([]) typeof array
 *  pass({}) typeof object 
 *  pass(null) typeof object
 *  pass(23) typeof number
 *  pass("hello") typeof string
 */
function pass <T>(param: T): T {
    return param
}

////////////////////////////////////////////

expect(pass([])).to.be.an("array");
expect(pass({})).to.be.an("object");
expect(pass(null)).to.be.an("object");
expect(pass(23)).to.be.an("number");
expect(pass("hello")).to.be.an("string");



/*******************************************
 *
 ******************************************/

/**
 * @example
 *  pass(["aa", 23, true]) !> ["aa", 23, true]
 *  pass(["aa", 23, true]) ==> ["aa", 23, true]
 *  pass(["aa", 23, true]) !=> ["aa", 23, false]
 *  pass({a: "aa", b: 23, c: true}) !> {a: "aa", b: 23, c: true}
 *  pass({a: "aa", b: 23, c: true}) ==> {a: "aa", b: 23, c: true}
 *  pass({a: "aa", b: 23, c: true}) !=> {a: "aa", b: 23, c: false}
 */
function pass <T>(param: T): T {
    return param
}

////////////////////////////////////////////

expect(pass(["aa", 23, true])).to.not.equal(["aa", 23, true]);
expect(pass(["aa", 23, true])).to.deep.equal(["aa", 23, true]);
expect(pass(["aa", 23, true])).to.not.deep.equal(["aa", 23, false]);
expect(pass({a: "aa", b: 23, c: true})).to.not.equal({a: "aa", b: 23, c: true});
expect(pass({a: "aa", b: 23, c: true})).to.deep.equal({a: "aa", b: 23, c: true});
expect(pass({a: "aa", b: 23, c: true})).to.not.deep.equal({a: "aa", b: 23, c: false});

/*******************************************
 *
 ******************************************/

/**
 * @example
 *  pass(5) < 10
 *  pass(5) <= 5
 *  pass(5) > 1
 *  pass(5) >= 5
 *  pass(5) >< 4 6
 *  pass(5) >< 4-6
 *  pass(5) >< 4, 6
 */
function pass <T>(param: T): T {
    return param
}

////////////////////////////////////////////

expect(pass(5)).to.be.lt(10);
expect(pass(5)).to.be.lte(5);
expect(pass(5)).to.be.gt(1);
expect(pass(5)).to.be.gte(5);
expect(pass(5)).to.be.within(4, 6);
expect(pass(5)).to.be.within(4, 6);
expect(pass(5)).to.be.within(4, 6);


/*******************************************
 *
 ******************************************/

/**
 * @example
 *  pass("gabriel") // 10
 */
function pass <T>(param: T): T {
    return param
}

////////////////////////////////////////////

expect(pass(5)).to.be.lt(10);
expect(pass(5)).to.be.lte(5);
expect(pass(5)).to.be.gt(1);
expect(pass(5)).to.be.gte(5);
expect(pass(5)).to.be.within(4, 6);
expect(pass(5)).to.be.within(4, 6);
expect(pass(5)).to.be.within(4, 6);



```
