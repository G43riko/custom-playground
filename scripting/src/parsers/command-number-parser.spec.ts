import { expect } from "chai";
import "mocha";
import { CommandNumberParser } from "./command-number-parser";


describe("Test number parser", () => {
    it("should parse numeric values", () => {
        const parser = new CommandNumberParser();
        expect(parser.parse("123")).to.deep.eq({result: 123, remains: ""});
        expect(parser.parse("   123")).to.deep.eq({result: 123, remains: ""});
        expect(parser.parse("123   ")).to.deep.eq({result: 123, remains: "   "});

        expect(parser.parse("123.456")).to.deep.eq({result: 123.456, remains: ""});
        expect(parser.parse("   123.456")).to.deep.eq({result: 123.456, remains: ""});
        expect(parser.parse("123.456   ")).to.deep.eq({result: 123.456, remains: "   "});
    });
});
