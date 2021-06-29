import {expect} from "chai";
import "mocha";
import {CommandTimeParser} from "./command-time-parser";

describe("Test time parser", () => {
    it("should parse time values", () => {
        const parser = new CommandTimeParser();
        expect(parser.parse("123 s")).to.deep.eq({result: {duration: 123, unit: "S"}, remains: ""});
        expect(parser.parse("   123 s")).to.deep.eq({result: {duration: 123, unit: "S"}, remains: ""});
        expect(parser.parse("123 s   ")).to.deep.eq({result: {duration: 123, unit: "S"}, remains: "   "});

        expect(parser.parse("123.456 ms")).to.deep.eq({result: {duration: 123.456, unit: "MS"}, remains: ""});
        expect(parser.parse("   123.456 ms")).to.deep.eq({result: {duration: 123.456, unit: "MS"}, remains: ""});
        expect(parser.parse("123.456 ms   ")).to.deep.eq({result: {duration: 123.456, unit: "MS"}, remains: "   "});

        expect(parser.parse("123S")).to.deep.eq({result: {duration: 123, unit: "S"}, remains: ""});
        expect(parser.parse("   123s")).to.deep.eq({result: {duration: 123, unit: "S"}, remains: ""});
        expect(parser.parse("123s   ")).to.deep.eq({result: {duration: 123, unit: "S"}, remains: "   "});

        expect(parser.parse("123.456MS")).to.deep.eq({result: {duration: 123.456, unit: "MS"}, remains: ""});
        expect(parser.parse("   123.456ms")).to.deep.eq({result: {duration: 123.456, unit: "MS"}, remains: ""});
        expect(parser.parse("123.456ms   ")).to.deep.eq({result: {duration: 123.456, unit: "MS"}, remains: "   "});
    });
});
