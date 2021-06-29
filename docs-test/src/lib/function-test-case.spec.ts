import {expect} from "chai";
import "mocha";
import {FunctionTestCase} from "./function-test-case";

describe("Test c function test cases", () => {
    it("should test basic test case", async () => {
        const testCase1 = FunctionTestCase.create("capitalize(\"gabo\") => Gabo");
        expect(testCase1?.getTests()).to.be.equal("expect(TESTED_OBJ.capitalize(\"gabo\")).to.be.equal(\"Gabo\");");
        const testCase2 = FunctionTestCase.create("capitalize(21) => 21");
        expect(testCase2?.getTests()).to.be.equal("expect(TESTED_OBJ.capitalize(21)).to.be.equal(21);");
        const testCase3 = FunctionTestCase.create("capitalize(true) => true");
        expect(testCase3?.getTests()).to.be.equal("expect(TESTED_OBJ.capitalize(true)).to.be.true;");
        const testCase4 = FunctionTestCase.create("capitalize(null) => null");
        expect(testCase4?.getTests()).to.be.equal("expect(TESTED_OBJ.capitalize(null)).to.be.null;");
        const testCase5 = FunctionTestCase.create("capitalize(undefined) => undefined");
        expect(testCase5?.getTests()).to.be.equal("expect(TESTED_OBJ.capitalize(undefined)).to.be.undefined;");

        const testCase6 = FunctionTestCase.create("capitalize({}) => {}");
        expect(testCase6?.getTests()).to.be.equal("expect(TESTED_OBJ.capitalize({})).to.be.equal({});");
        const testCase7 = FunctionTestCase.create("capitalize([]) => []");
        expect(testCase7?.getTests()).to.be.equal("expect(TESTED_OBJ.capitalize([])).to.be.equal([]);");

        const testCase8 = FunctionTestCase.create("capitalize({}) ==> {}");
        expect(testCase8?.getTests()).to.be.equal("expect(TESTED_OBJ.capitalize({})).to.deep.equal({});");
        const testCase9 = FunctionTestCase.create("capitalize([]) ==> []");
        expect(testCase9?.getTests()).to.be.equal("expect(TESTED_OBJ.capitalize([])).to.deep.equal([]);");
    });
});
