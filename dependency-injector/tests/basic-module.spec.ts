import { expect } from 'chai';
import 'mocha';
import { InjectableServiceA } from "./mock/injectable-service-a.service";
import { InjectableServiceB } from "./mock/injectable-service-b.service";
import * as DI from "./test";

@DI.Module({
    providers: [
        InjectableServiceA,
        InjectableServiceB,
    ]
})
class ModuleA {
    public constructor(public readonly serviceA: InjectableServiceA,
                       public readonly serviceB: InjectableServiceB,
    ) {
    }
}

describe('Test basic module', () => {
    it('should return hello world', () => {
        const factory = DI.getModuleFactory(ModuleA);
        expect(factory).to.exist;

        const result = factory.require(ModuleA);
        expect(result).to.exist;


        const serviceA = factory.require(InjectableServiceA);
        const serviceB = factory.require(InjectableServiceB);

        expect(serviceA).to.exist;
        expect(serviceA).to.be.instanceOf(InjectableServiceA);
        expect(serviceB).to.exist;
        expect(serviceB).to.be.instanceOf(InjectableServiceB);

        expect(result.serviceA).to.exist;
        expect(result.serviceA).to.equal(serviceA);

        expect(result.serviceB).to.exist;
        expect(result.serviceB).to.equal(serviceB);
    });
});
