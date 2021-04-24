import { expect } from "chai";
import "mocha";
import { CommandStringParser } from "./command-string-parser";

describe("Test string parser", () => {
    it("should parse string values", () => {
        const parser = new CommandStringParser();
        expect(parser.parse("Gabo")).to.deep.eq({result: "Gabo", remains: ""});
        expect(parser.parse("   Gabo")).to.deep.eq({result: "Gabo", remains: ""});
        expect(parser.parse("Gabo   ")).to.deep.eq({result: "Gabo", remains: "   "});
        expect(parser.parse("   Gabo   ")).to.deep.eq({result: "Gabo", remains: "   "});

        expect(parser.parse("\"Gabo Gabo\"")).to.deep.eq({result: "Gabo Gabo", remains: ""});
        expect(parser.parse("   \"Gabo Gabo\"")).to.deep.eq({result: "Gabo Gabo", remains: ""});
        expect(parser.parse("\"Gabo Gabo\"   ")).to.deep.eq({result: "Gabo Gabo", remains: "   "});
        expect(parser.parse("   \"Gabo Gabo\"   ")).to.deep.eq({result: "Gabo Gabo", remains: "   "});
    });
});
