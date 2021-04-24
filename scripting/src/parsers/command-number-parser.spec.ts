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
    it("should parse integer numeric values", () => {
        const parser = new CommandNumberParser(true);
        expect(parser.parse("123")).to.deep.eq({result: 123, remains: ""});
        expect(parser.parse("   123")).to.deep.eq({result: 123, remains: ""});
        expect(parser.parse("123   ")).to.deep.eq({result: 123, remains: "   "});

        expect(parser.parse("123.456")).to.be.null;
        expect(parser.parse("   123.456")).to.be.null;
        expect(parser.parse("123.456   ")).to.be.null;
    });

    it("should return null on invalid numeric values", () => {
        const parser = new CommandNumberParser();
        expect(parser.parse("")).to.be.null;
        expect(parser.parse("        ")).to.be.null;
        expect(parser.parse("ascdsacas")).to.be.null;
        expect(parser.parse("a15648")).to.be.null;
    });

});
