import { expect } from 'chai';
import 'mocha';
import { createForwardRef, isForwardRef, resolveForwardRef } from "../src/holders/forward-ref-holder";
import * as DI from "./test";

@DI.Injectable()
class ServiceA {
    public constructor(@DI.ForwardRef(() => ServiceB) public readonly serviceB: ServiceB) {
    }

}

@DI.Injectable()
class ServiceB {
    public constructor(public readonly serviceA: ServiceA) {
    }

}

class EmptyService {
}


describe('Test forwardRef', () => {
    it("should test creating of undefined", () => {
        expect(isForwardRef(undefined as any)).to.be.undefined;
        expect(resolveForwardRef()).to.be.undefined;
    });
    it("should test forwardRef types", () => {
        const forwardRef = createForwardRef(() => EmptyService);
        expect(forwardRef).to.exist;
        expect(isForwardRef(forwardRef)).to.be.true;
        const resolvedForwardRef = resolveForwardRef(forwardRef);
        expect(resolvedForwardRef).to.equal(EmptyService);
    });

    it('should test cyclic dependencies using forwardRef', () => {
        const factory = DI.createStaticFactory([ServiceA, ServiceB]);
        expect(factory).to.exist;

        const serviceA = factory.require(ServiceA);
        const serviceB = factory.require(ServiceB);

        expect(serviceA).to.exist;
        expect(serviceA).to.be.instanceOf(ServiceA);
        expect(serviceB).to.exist;
        expect(serviceB).to.be.instanceOf(ServiceB);

        expect(serviceA.serviceB).to.equal(serviceB);
        expect(serviceA.serviceB.serviceA).to.equal(serviceA);

        expect(serviceB.serviceA).to.equal(serviceA);
        expect(serviceB.serviceA.serviceB).to.equal(serviceB);

    });
});
