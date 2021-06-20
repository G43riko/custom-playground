import "mocha";
import {expect} from "chai";
import {FileArrayDatabase} from "./file-array-database";
import {StatefulDataAccessor} from "./stateful-data-accessor";
import {catchError, map} from "rxjs/operators";
import {of} from "rxjs";
import {SimpleFileAccessor} from "./data-accessors/simple-file-accessor";


describe("Test simple array database", () => {
    it("should test not existing file loading", async () => {
        const database = new FileArrayDatabase(__dirname + "/testA.txt");
        const databaseWithDefaultData = new FileArrayDatabase(__dirname + "/testB.txt", ["a", 1, false]);

        expect(await database.data$.toPromise()).to.deep.equal([]);
        expect(await databaseWithDefaultData.data$.toPromise()).to.deep.equal(["a", 1, false]);

    });

    it("should test basic file loading and saving", async () => {
        const fileAccessor = new FileArrayDatabase(__dirname + "/test2.txt");
        await fileAccessor.writeFile(JSON.stringify(["a", 1, false])).toPromise();
        const result = await fileAccessor.getRawDataOnce().toPromise();
        expect(result).to.be.equal(JSON.stringify(["a", 1, false]));

    });


    it("should test basic file loading and saving with default data", async () => {
        const fileAccessor = new FileArrayDatabase(__dirname + "/test3.txt", ["a", 1, false]);
        const result = await fileAccessor.getDataOnce().toPromise();
        expect(result).to.deep.equal(["a", 1, false]);
    });


    it("should test data accessing", async () => {
        const fileAccessor = new FileArrayDatabase(__dirname + "/test4.txt", [1, 2, 3, 4]);
        const resultA = await fileAccessor.findOne((item) => item > 2).toPromise();
        const resultB = await fileAccessor.findMore((item) => item % 2 === 0).toPromise();
        expect(resultA).to.be.equal(3);
        expect(resultB).to.deep.equal([2, 4]);
    });

    it("should test data inserting", async () => {
        const fileAccessor = new FileArrayDatabase(__dirname + "/test5.txt");
        const data = new StatefulDataAccessor(new SimpleFileAccessor(__dirname + "/test5.txt"));
        await data.writeFile(JSON.stringify([1, 2, 3, 4])).toPromise();
        console.log("1", await fileAccessor.getRawDataOnce().pipe(catchError((e) => of(e))).toPromise(), await fileAccessor.getDataOnce().pipe(catchError((e) => of(e))).toPromise());
        console.log(await fileAccessor.insertOne(5).toPromise());
        console.log("2", await fileAccessor.getRawDataOnce().pipe(catchError((e) => of(e))).toPromise(), await fileAccessor.getDataOnce().pipe(catchError((e) => of(e))).toPromise());
        console.log(await fileAccessor.insertMore([6, 7, 8, 9]).toPromise());
        console.log("3", await fileAccessor.getRawDataOnce().pipe(catchError((e) => of(e))).toPromise(), await fileAccessor.getDataOnce().pipe(catchError((e) => of(e))).toPromise());
        const content = await data.getRawDataOnce().pipe(map((content) => JSON.parse(content))).toPromise();
        expect(content).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
});
