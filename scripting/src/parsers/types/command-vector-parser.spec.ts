import { expect } from "chai";
import "mocha";
import { CommandVectorParser } from "./command-vector-parser";


describe("Test vector parser", () => {
    it("should parseType 2 dimension vector values", () => {
        const parser = new CommandVectorParser(2);
        expect(parser.parse("123 456")).to.deep.eq({result: [123, 456], remains: ""});
        expect(parser.parse("   123 456")).to.deep.eq({result: [123, 456], remains: ""});
        expect(parser.parse("123 456   ")).to.deep.eq({result: [123, 456], remains: "   "});

        expect(parser.parse("123.456 7.89")).to.deep.eq({result: [123.456, 7.89], remains: ""});
        expect(parser.parse("   123.456 7.89")).to.deep.eq({result: [123.456, 7.89], remains: ""});
        expect(parser.parse("123.456 7.89   ")).to.deep.eq({result: [123.456, 7.89], remains: "   "});
    });
    it("should parseType 2 dimension vector integer values", () => {
        const parser = new CommandVectorParser(2, true);
        expect(parser.parse("123 456")).to.deep.eq({result: [123, 456], remains: ""});
        expect(parser.parse("   123 456")).to.deep.eq({result: [123, 456], remains: ""});
        expect(parser.parse("123 456   ")).to.deep.eq({result: [123, 456], remains: "   "});

        expect(parser.parse("123.456 7.89")).to.be.null;
        expect(parser.parse("   123.456 7.89")).to.be.null;
        expect(parser.parse("123.456 7.89   ")).to.be.null;
    });
    it("should return null on invalid value", () => {
        const parser = new CommandVectorParser(2);
        expect(parser.parse("123")).to.be.null;
        expect(parser.parse("   123")).to.be.null;
        expect(parser.parse("123   ")).to.be.null;

        expect(parser.parse("gabo")).to.be.null;
        expect(parser.parse("   gabo")).to.be.null;
        expect(parser.parse("gabo   ")).to.be.null;
    });
});
