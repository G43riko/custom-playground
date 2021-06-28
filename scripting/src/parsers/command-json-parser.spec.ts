import {expect} from "chai";
import "mocha";
import {CommandJSONParser} from "./command-json-parser";


describe("Test json parser", () => {
    it("should parse empty json values", () => {
        const parser = new CommandJSONParser();
        expect(parser.parse("{}")).to.deep.eq({result: {}, remains: ""});
        expect(parser.parse("   {}")).to.deep.eq({result: {}, remains: ""});
        expect(parser.parse("{}   ")).to.deep.eq({result: {}, remains: "   "});

        expect(parser.parse("[]")).to.deep.eq({result: [], remains: ""});
        expect(parser.parse("   []")).to.deep.eq({result: [], remains: ""});
        expect(parser.parse("[]   ")).to.deep.eq({result: [], remains: "   "});
    });
    it("should parse nested array json", () => {
        const parser = new CommandJSONParser();
        expect(parser.parse("[[[], []], [{}, []]]")).to.deep.eq({result: [[[], []], [{}, []]], remains: ""});
        expect(parser.parse("   [[[], []], [{}, []]]")).to.deep.eq({result: [[[], []], [{}, []]], remains: ""});
        expect(parser.parse("[[[], []], [{}, []]]   ")).to.deep.eq({result: [[[], []], [{}, []]], remains: "   "});
    });
    it("should parse all object types json values", () => {
        const parser = new CommandJSONParser();
        expect(parser.parse("{\"a\": \"A\", \"b\": 1, \"c\": true, \"d\": {}, \"e\": []}")).to.deep.eq({
            result: {
                a: "A",
                b: 1,
                c: true,
                d: {},
                e: [],
            },
            remains: "",
        });
        expect(parser.parse("   {\"a\": \"A\", \"b\": 1, \"c\": true, \"d\": {}, \"e\": []}")).to.deep.eq({
            result: {
                a: "A",
                b: 1,
                c: true,
                d: {},
                e: [],
            },
            remains: "",
        });
        expect(parser.parse("{\"a\": \"A\", \"b\": 1, \"c\": true, \"d\": {}, \"e\": []}   ")).to.deep.eq({
            result: {
                a: "A",
                b: 1,
                c: true,
                d: {},
                e: [],
            },
            remains: "   ",
        });

        expect(parser.parse("[\"a\", 2, true, {}, []]")).to.deep.eq({result: ["a", 2, true, {}, []], remains: ""});
        expect(parser.parse("   [\"a\", 2, true, {}, []]")).to.deep.eq({result: ["a", 2, true, {}, []], remains: ""});
        expect(parser.parse("[\"a\", 2, true, {}, []]   ")).to.deep.eq({
            result: ["a", 2, true, {}, []],
            remains: "   ",
        });
    });

});
