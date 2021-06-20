import "mocha";
import {expect} from "chai";
import {SimpleFileAccessor} from "./simple-file-accessor";


describe("Test simple file accessor", () => {
    it("should test not existing file loading", async () => {
        const fileAccessor = new SimpleFileAccessor(__dirname + "/test.txt");

        await expect(async () => await fileAccessor.readFile().toPromise()).to.throw;
    });

    it("should test basic file loading and saving", async () => {
        const fileAccessor = new SimpleFileAccessor(__dirname + "/test2.txt");
        await fileAccessor.writeFile(JSON.stringify(["a", "b"])).toPromise();

        expect(await fileAccessor.readFile().toPromise()).to.be.equal(JSON.stringify(["a", "b"]));

    });
});
