import { expect } from 'chai';
import 'mocha';
import { InjectableServiceA } from "./mock/injectable-service-a.service";
import { App, BasicApp, getAppFactory, Injectable, Module, startApp } from "./test";

@Injectable()
class ServiceAForModuleA {
}

@Injectable()
class ServiceBForModuleA {
}


@Module({
    providers: [
        ServiceAForModuleA,
        ServiceBForModuleA,
    ],
})
class ModuleA {
    public constructor(public readonly serviceA: ServiceAForModuleA,
                       public readonly serviceB: ServiceBForModuleA,
                       public readonly globalInjectableServiceA: InjectableServiceA) {
    }
}


@Module()
class ModuleB {
}

@App({
    modules  : [
        ModuleA,
        ModuleB,
    ],
    providers: [
        InjectableServiceA,
    ]
})
class MainApp implements BasicApp {
    public start(): number {
        return 0;
    }
}

describe('Test basic app', () => {
    it('should create basic app', (done) => {
        const appFactory = getAppFactory(MainApp);

        const app = appFactory.getDependency(MainApp);

        expect(app).to.exist;
        expect(app).to.be.instanceOf(MainApp);

        const moduleA = appFactory.getDependency(ModuleA);
        const moduleB = appFactory.getDependency(ModuleB);

        expect(moduleA).to.exist;
        expect(moduleA).to.be.instanceOf(ModuleA);
        expect(moduleB).to.exist;
        expect(moduleB).to.be.instanceOf(ModuleB);


        expect(moduleA?.serviceA).to.exist;
        expect(moduleA?.serviceB).to.exist;
        expect(moduleA?.globalInjectableServiceA).to.exist;


        const serviceA       = appFactory.getDependency(ServiceAForModuleA);
        const serviceB       = appFactory.getDependency(ServiceBForModuleA);
        const globalServiceB = appFactory.getDependency(InjectableServiceA);


        expect(serviceA).to.exist;
        expect(serviceA).to.be.instanceOf(ServiceAForModuleA);
        expect(serviceB).to.exist;
        expect(serviceB).to.be.instanceOf(ServiceBForModuleA);
        expect(globalServiceB).to.exist;
        expect(globalServiceB).to.be.instanceOf(InjectableServiceA);

        startApp(MainApp).then((result) => {
            expect(result).to.equal(0);
            done();
        });
    });
});
