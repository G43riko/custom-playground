import { expect } from 'chai';
import 'mocha';
import { InjectableServiceA } from "./mock/injectable-service-a.service";
import { ServiceC } from "./mock/service-c.service";
import * as DI from "./test";


@DI.Injectable()
class ServiceB {
    public constructor(public readonly serviceA: InjectableServiceA) {
    }
}

@DI.Injectable()
class ServiceD {
    public constructor(public readonly serviceC: ServiceC) {
    }
}

describe('Test basic injection', () => {
    it('should test not provided services', () => {
        const factory = DI.createStaticFactory([]);
        expect(factory.getDependency(InjectableServiceA)).to.be.undefined;
        expect(factory.getDependency(ServiceB)).to.be.undefined;
        expect(factory.getDependency(ServiceC)).to.be.undefined;
        expect(factory.getDependency(ServiceD)).to.be.undefined;

        expect(() => factory.require(InjectableServiceA)).to.be.throw(/InjectableServiceA/);
        expect(() => factory.require(ServiceB)).to.be.throw(/ServiceB/);
        expect(() => factory.require(ServiceC)).to.be.throw(/ServiceC/);
        expect(() => factory.require(ServiceD)).to.be.throw(/ServiceD/);
    });

    it('should test default values', () => {
        const factory  = DI.createStaticFactory([]);
        const serviceA = new InjectableServiceA();
        const serviceB = new ServiceB(serviceA);
        const serviceC = new ServiceC();
        const serviceD = new ServiceD(serviceC);

        expect(factory.getDependency(InjectableServiceA, serviceA)).to.be.equal(serviceA);
        expect(factory.getDependency(ServiceB, serviceB)).to.be.equal(serviceB);
        expect(factory.getDependency(ServiceC, serviceC)).to.be.equal(serviceC);
        expect(factory.getDependency(ServiceD, serviceD)).to.be.equal(serviceD);
    });

    it('should test require missing dependencies', () => {
        const factory = DI.createStaticFactory([InjectableServiceA, ServiceB]);
        expect(factory).to.exist;

        const serviceA = factory.require(InjectableServiceA);
        const serviceB = factory.getDependency(ServiceB, ServiceD as any);

        expect(() => factory.require(ServiceD)).to.throw(ServiceD.name);
        expect(() => factory.require(ServiceC)).to.throw(ServiceC.name);

        expect(serviceA).to.exist;
        expect(serviceA).to.be.instanceOf(InjectableServiceA);
        expect(serviceB).to.exist;
        expect(serviceB).to.be.instanceOf(ServiceB);
        expect(serviceB.serviceA).to.be.equal(serviceA);
    });
    it('should test not injectableInjections', () => {
        const factory = DI.createStaticFactory([InjectableServiceA, ServiceB, ServiceC, ServiceD]);
        expect(factory).to.exist;

        const serviceA = factory.require(InjectableServiceA);
        const serviceB = factory.require(ServiceB);
        const serviceC = factory.require(ServiceC);
        const serviceD = factory.require(ServiceD);

        expect(serviceA).to.exist;
        expect(serviceA).to.be.instanceOf(InjectableServiceA);
        expect(serviceB).to.exist;
        expect(serviceB).to.be.instanceOf(ServiceB);
        expect(serviceC).to.exist;
        expect(serviceC).to.be.instanceOf(ServiceC);
        expect(serviceD).to.exist;
        expect(serviceD).to.be.instanceOf(ServiceD);

        expect(serviceB.serviceA).to.be.equal(serviceA);
        expect(serviceD.serviceC).to.be.equal(serviceC);
    });

    it('should test basic injections', () => {
        const factory = DI.createStaticFactory([InjectableServiceA, ServiceB]);
        expect(factory).to.exist;

        const serviceA = factory.require(InjectableServiceA);
        const serviceB = factory.require(ServiceB);

        expect(serviceA).to.exist;
        expect(serviceA).to.be.instanceOf(InjectableServiceA);
        expect(serviceB).to.exist;
        expect(serviceB).to.be.instanceOf(ServiceB);
        // TODO: FIX THIS
        // expect(serviceB.serviceA).to.equal(serviceA);
    });
});
