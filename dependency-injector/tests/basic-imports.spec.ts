import { expect } from 'chai';
import 'mocha';
import { InjectableServiceA } from "./mock/injectable-service-a.service";
import { InjectableServiceB } from "./mock/injectable-service-b.service";
import * as DI from "./test";

@DI.Module({
    providers: [
        InjectableServiceA,
    ]
})
class ModuleA {
    public constructor(public readonly serviceA: InjectableServiceA) {
    }
}


@DI.Module({
    providers: [
        InjectableServiceB,
    ],
    imports  : [
        ModuleA
    ]
})
class ModuleB {
    public constructor(public readonly serviceA: InjectableServiceA,
                       public readonly serviceB: InjectableServiceB,
    ) {
    }
}

@DI.Module()
class ModuleC {
    public constructor(@DI.Optional() public readonly serviceA: InjectableServiceA,
                       @DI.Optional() public readonly serviceB: InjectableServiceB,
    ) {
    }
}

@DI.Module({
    providers: [
        InjectableServiceA,
    ]
})
class ModuleD {
    public constructor(public readonly serviceA: InjectableServiceA,
                       public readonly serviceB: InjectableServiceB,
    ) {
    }
}

@DI.Module()
class ModuleE {
    public constructor(public readonly serviceA: InjectableServiceA,
                       public readonly serviceB: InjectableServiceB,
    ) {
    }
}

@DI.Module({
    providers: [
        InjectableServiceA,
    ]
})
class ModuleF {
    public constructor(public readonly serviceA: InjectableServiceA,
                       @DI.Optional() public readonly serviceB: InjectableServiceB,
    ) {
    }
}

describe('Test module imports', () => {
    it('should return hello world', () => {
        const moduleFactoryA = DI.getModuleFactory(ModuleA);
        const moduleFactoryB = DI.getModuleFactory(ModuleB);
        const moduleFactoryC = DI.getModuleFactory(ModuleC);
        const moduleFactoryF = DI.getModuleFactory(ModuleF);

        expect(moduleFactoryA).to.exist;
        expect(moduleFactoryB).to.exist;
        expect(moduleFactoryC).to.exist;
        expect(() => DI.getModuleFactory(ModuleD)).to.throw();
        expect(() => DI.getModuleFactory(ModuleE)).to.throw();
        expect(moduleFactoryF).to.exist;

        const moduleA = moduleFactoryA.getDependency(ModuleA);
        const moduleB = moduleFactoryB.getDependency(ModuleB);
        const moduleC = moduleFactoryC.getDependency(ModuleC);
        const moduleF = moduleFactoryF.getDependency(ModuleF);

        expect(moduleA).to.exist;
        expect(moduleB).to.exist;
        expect(moduleC).to.exist;
        expect(moduleF).to.exist;


        expect(moduleA?.serviceA).to.exist;

        expect(moduleB?.serviceA).to.exist;
        expect(moduleB?.serviceB).to.exist;

        expect(moduleC?.serviceA).to.not.exist;
        expect(moduleC?.serviceB).to.not.exist;

        expect(moduleF?.serviceA).to.exist;
        expect(moduleF?.serviceB).to.not.exist;

    });
});
