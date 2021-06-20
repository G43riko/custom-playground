import "mocha";
import {expect} from "chai";
import {StatefulDataAccessor} from "./stateful-data-accessor";
import {SimpleFileAccessor} from "./data-accessors/simple-file-accessor";


describe("Test stateful file accessor", () => {
    it("should test not existing file loading", async () => {
        const fileAccessor = new StatefulDataAccessor(new SimpleFileAccessor(__dirname + "/testSt.txt"));

        await expect(async () => await fileAccessor.getRawDataOnce().toPromise()).to.throw;
    });

    it("should test basic file loading and saving", async () => {
        const fileAccessor = new StatefulDataAccessor(new SimpleFileAccessor(__dirname + "/test2.txt"));
        await fileAccessor.writeFile(JSON.stringify(["a", "b"])).toPromise();

        expect(await fileAccessor.getRawDataOnce().toPromise()).to.be.equal(JSON.stringify(["a", "b"]));
    });

    it("should test multiple read write operations", async () => {
        const fileAccessor = new StatefulDataAccessor(new SimpleFileAccessor(__dirname + "/test2.txt"));
        await fileAccessor.writeFile(JSON.stringify([1, "c", false])).toPromise();

        expect(await fileAccessor.getRawDataOnce().toPromise()).to.be.equal(JSON.stringify([1, "c", false]));
        await fileAccessor.writeFile(JSON.stringify([2, "d", true])).toPromise();
        expect(await fileAccessor.getRawDataOnce().toPromise()).to.be.equal(JSON.stringify([2, "d", true]));
        await fileAccessor.writeFile(JSON.stringify([1, 2, 3])).toPromise();
        await fileAccessor.writeFile(JSON.stringify(["a", "b"])).toPromise();
        expect(await fileAccessor.getRawDataOnce().toPromise()).to.be.equal(JSON.stringify(["a", "b"]));
    });
});
