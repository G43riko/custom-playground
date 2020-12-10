import { expect } from 'chai'
import 'mocha';
import * as TESTED_OBJ from './file';

describe("file", () => {
    it("It should test function cutUsing", () => {
        expect(TESTED_OBJ.cutUsing("abcdefghij", 10)).to.be.equal("abcdefghij");
        expect(TESTED_OBJ.cutUsing("abcdefghij", 15)).to.be.equal("abcdefghij");
        expect(TESTED_OBJ.cutUsing("abcdefghij", 9)).to.be.equal("abcdefg...");
        expect(TESTED_OBJ.cutUsing("abcdefghij", 9, "...", false)).to.be.equal("abcdefghi...");
    });
    it("It should test function capitalize", () => {
        expect(TESTED_OBJ.capitalize("gabo")).to.be.equal("Gabo");
        expect(TESTED_OBJ.capitalize("GABO")).to.be.equal("Gabo");
        expect(TESTED_OBJ.capitalize("gABO")).to.be.equal("Gabo");
    });
    it("It should test function template", () => {
        expect(TESTED_OBJ.template("{{name}} is {{age}} years old", {name: "Gabriel", age: 23}))
            .to
            .be
            .equal("Gabriel is 23 years old");
    });
    it("It should test function between", () => {
        expect(TESTED_OBJ.between("my name is gabriel and I am 26 years old", "NAME", "gabriel"))
            .to
            .be
            .equal("my name is ");
        expect(TESTED_OBJ.between("my name is gabriel and I am 26 years old", "name", "GABRIEL"))
            .to
            .be
            .equal(" is gabriel and I am 26 years old");
        expect(TESTED_OBJ.between("my name is gabriel and I am 26 years old", "name", "gabriel")).to.be.equal(" is ");
        expect(TESTED_OBJ.between("my name is gabriel and I am 26 years old", "name", "gabriel", true))
            .to
            .be
            .equal("is");
    });
    it("It should test function occurrences", () => {
        expect(TESTED_OBJ.occurrences("foofoofoo", "bar")).to.be.equal(0);
        expect(TESTED_OBJ.occurrences("foofoofoo", "foo")).to.be.equal(3);
        expect(TESTED_OBJ.occurrences("foofoofoo", "foofoo")).to.be.equal(1);
        expect(TESTED_OBJ.occurrences("foofoofoo", "foofoo", true)).to.be.equal(2);
    });
    it("It should test function format", () => {
        expect(TESTED_OBJ.format("{} is a big {}", ["Gabo", "hero"])).to.be.equal("Gabo is a big hero");
        expect(TESTED_OBJ.format("<> is a big <>", ["Gabo", "hero"], "<>")).to.be.equal("Gabo is a big hero");
    });
    it("It should test function getAsciiArray", () => {
        expect(TESTED_OBJ.getAsciiArray("abcdefg")).to.deep.equal([97, 98, 99, 100, 101, 102, 103]);
    });
    it("It should test function joinSingle", () => {
        expect(TESTED_OBJ.joinSingle("package", ".", "json")).to.be.equal("package.json");
        expect(TESTED_OBJ.joinSingle("package.", ".", "json")).to.be.equal("package.json");
        expect(TESTED_OBJ.joinSingle("package", ".", ".json")).to.be.equal("package.json");
        expect(TESTED_OBJ.joinSingle("package.", ".", ".json")).to.be.equal("package.json");
    });
});
