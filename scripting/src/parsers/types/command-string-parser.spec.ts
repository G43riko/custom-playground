import { expect } from "chai";
import "mocha";
import { CommandStringParser } from "./command-string-parser";

describe("Test string parser", () => {
    it("should parseType string values", () => {
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
    it("should parseType string values with pattern", () => {
        const parser = new CommandStringParser(/aB/i);
        expect(parser.parse("Gabo")).to.deep.eq({result: "Gabo", remains: ""});
        expect(parser.parse("   Gabo")).to.deep.eq({result: "Gabo", remains: ""});
        expect(parser.parse("Gabo   ")).to.deep.eq({result: "Gabo", remains: "   "});
        expect(parser.parse("   Gabo   ")).to.deep.eq({result: "Gabo", remains: "   "});

        expect(parser.parse("\"Gabo Gabo\"")).to.deep.eq({result: "Gabo Gabo", remains: ""});
        expect(parser.parse("   \"Gabo Gabo\"")).to.deep.eq({result: "Gabo Gabo", remains: ""});
        expect(parser.parse("\"Gabo Gabo\"   ")).to.deep.eq({result: "Gabo Gabo", remains: "   "});
        expect(parser.parse("   \"Gabo Gabo\"   ")).to.deep.eq({result: "Gabo Gabo", remains: "   "});

        expect(parser.parse("GaRbo")).to.be.null;
        expect(parser.parse("   GaRbo")).to.be.null;
        expect(parser.parse("GaRbo   ")).to.be.null;
        expect(parser.parse("   GaRbo   ")).to.be.null;

        expect(parser.parse("\"GaRbo GaRbo\"")).to.be.null;
        expect(parser.parse("   \"GaRbo GaRbo\"")).to.be.null;
        expect(parser.parse("\"GaRbo GaRbo\"   ")).to.be.null;
        expect(parser.parse("   \"GaRbo GaRbo\"   ")).to.be.null;
    });
});
