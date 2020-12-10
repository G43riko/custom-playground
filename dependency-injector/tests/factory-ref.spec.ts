import { expect } from 'chai';
import 'mocha';
import { Factory } from "../src/factory/factory.interface";
import { createStaticFactory, FactoryRef } from "./test";

class ServiceWithFactoryRef {
    public constructor(@FactoryRef() public readonly factoryRef: Factory) {
    }
}

describe('Test factoryRef', () => {
    it('should return hello world', () => {
        const factory = createStaticFactory([ServiceWithFactoryRef]);
        expect(factory).to.exist;

        const service = factory.getDependency(ServiceWithFactoryRef);
        expect(service).to.exist;
        expect(service).to.be.instanceOf(ServiceWithFactoryRef);
        expect(service?.factoryRef).to.exist;
        expect(service?.factoryRef).to.equal(factory);
    });
});
