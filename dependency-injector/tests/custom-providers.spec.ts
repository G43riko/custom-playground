import { expect } from 'chai';
import 'mocha';
import * as DI from "./test";

const values = {
    name   : "Gabriel",
    surName: "Csollei",
    age    : 28,
};

@DI.Injectable()
class AgeService {
    public constructor(private readonly age: number) {
    }

    public toString(): string {
        return String(this.age);
    }
}

class SurNameService {
    public toString(): string {
        return String(values.surName);
    }
}

class ServiceA {
    public constructor(@DI.Inject("Name") private readonly name: string,
                       @DI.Inject("SurName") private readonly surName: string,
                       private readonly age: AgeService) {
    }

    public get introduction(): string {
        return `Hello, I am ${this.name} ${this.surName} and I am ${this.age} years old`;
    }
}

describe('Test custom providers', () => {
    it('should return hello world', () => {
        const factory = DI.createStaticFactory([
            ServiceA,
            {
                token   : "Name",
                useValue: "Gabriel",
            },
            {
                token   : "SurName",
                useClass: SurNameService,
            },
            {
                token  : AgeService,
                factory: () => new AgeService(28),
            }
        ]);
        expect(factory).to.exist;
        const serviceA = factory.require(ServiceA);
        expect(serviceA).to.exist;
        expect(serviceA).to.be.instanceOf(ServiceA);

        const expectedService = new ServiceA(values.name, values.surName, new AgeService(values.age));

        expect(serviceA.introduction).to.equal(expectedService.introduction);
    });
});
