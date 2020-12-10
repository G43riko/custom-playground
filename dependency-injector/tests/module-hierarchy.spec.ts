import { expect } from 'chai';
import 'mocha';
import { InjectableServiceA } from "./mock/injectable-service-a.service";
import * as DI from "./test";

@DI.Injectable()
class ServiceB {
    public constructor(public readonly serviceA: InjectableServiceA) {

    }

}

@DI.Module({
    name     : "ModuleParent",
    providers: [
        InjectableServiceA,
    ]
})
export class ModuleParent {
    public constructor(public readonly serviceA: InjectableServiceA) {
    }
}

@DI.Module({
    name     : "ModuleChild",
    providers: [
        ServiceB,
    ],
    imports  : [
        ModuleParent,
    ]
})
export class ModuleChild {
    public constructor(public readonly serviceA: InjectableServiceA,
                       public readonly serviceB: ServiceB) {
    }
}


describe('Test module hierarchy', () => {
    it('should create parent module', () => {
        const parentModuleFactory = DI.getModuleFactory(ModuleParent);

        expect(parentModuleFactory).to.exist;

        const parentModule                   = parentModuleFactory.require(ModuleParent);
        const parentGlobalInjectableServiceA = parentModuleFactory.require(InjectableServiceA);
        expect(parentModule).to.exist;
        expect(parentModule).to.be.instanceOf(ModuleParent);
        expect(parentGlobalInjectableServiceA).to.exist;
        expect(parentGlobalInjectableServiceA).to.be.instanceOf(InjectableServiceA);

        expect(parentModule.serviceA).to.exist;
        expect(parentModule.serviceA).to.equal(parentGlobalInjectableServiceA);

    })
    it('should create child module', () => {

        const childModuleFactory = DI.getModuleFactory(ModuleChild);

        expect(childModuleFactory).to.exist;

        const childModule                   = childModuleFactory.require(ModuleChild);
        const parentModuleFromChildFactory  = childModuleFactory.require(ModuleParent);
        const childGlobalInjectableServiceA = childModuleFactory.require(InjectableServiceA);
        const childServiceB                 = childModuleFactory.require(ServiceB);
        expect(childModule).to.be.instanceOf(ModuleChild);
        expect(childGlobalInjectableServiceA).to.exist;
        expect(childGlobalInjectableServiceA).to.be.instanceOf(InjectableServiceA);
        expect(parentModuleFromChildFactory).to.exist;
        expect(parentModuleFromChildFactory).to.be.instanceOf(ModuleParent);
        expect(childServiceB).to.exist;
        expect(childServiceB).to.be.instanceOf(ServiceB);
        expect(childServiceB.serviceA).to.exist;
        expect(childServiceB.serviceA).to.equal(childGlobalInjectableServiceA);

        // expect(childGlobalInjectableServiceA).to.equal(parentGlobalInjectableServiceA);
        // expect(childModule.serviceA).to.equal(parentModule.serviceA);


        expect(childModule.serviceA).to.exist;
        expect(childModule.serviceB).to.exist;

        expect(childModule.serviceA).to.equal(childGlobalInjectableServiceA);
        expect(childModule.serviceB).to.equal(childServiceB);

    });
});
