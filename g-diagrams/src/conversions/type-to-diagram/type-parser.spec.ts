import "mocha";
import {TypeParser} from "./type-parser";

class A {
    public publicStringProperty = "publicStringProperty";
    protected protectedStringProperty = "protectedStringProperty";
    private privateStringProperty = "privateStringProperty";
    public readonly publicReadonlyStringProperty = "publicReadonlyStringProperty";
    protected readonly protectedReadonlyStringProperty = "protectedReadonlyStringProperty";
    private readonly privateReadonlyStringProperty = "privateReadonlyStringProperty";
    public static readonly publicStaticReadonlyStringProperty = "publicStaticReadonlyStringProperty";
    protected static readonly protectedStaticReadonlyStringProperty = "protectedStaticReadonlyStringProperty";
    private static readonly privateStaticReadonlyStringProperty = "privateStaticReadonlyProperty";

    public publicNumberProperty = 1;
    protected protectedNumberProperty = 1;
    private privateNumberProperty = 1;
    public readonly publicReadonlyNumberProperty = 1;
    protected readonly protectedReadonlyNumberProperty = 1;
    private readonly privateReadonlyNumberProperty = 1;
    public static readonly publicStaticReadonlyNumberProperty = 1;
    protected static readonly protectedStaticReadonlyNumberProperty = 1;
    private static readonly privateStaticReadonlyNumberProperty = 1;

    public publicBooleanProperty = true;
    protected protectedBooleanProperty = true;
    private privateBooleanProperty = true;
    public readonly publicReadonlyBooleanProperty = true;
    protected readonly protectedReadonlyBooleanProperty = true;
    private readonly privateReadonlyBooleanProperty = true;
    public static readonly publicStaticReadonlyBooleanProperty = true;
    protected static readonly protectedStaticReadonlyBooleanProperty = true;
    private static readonly privateStaticReadonlyBooleanProperty = true;


    public publicVoidMethod(): void {
        // empty
    }

    protected protectedVoidMethod(): void {
        // empty
    }

    private privateVoidMethod(): void {
        // empty
    }

    public publicVoidMethodWithParameter(a: number): void {
        // empty
    }

    public publicVoidMethodWithDefaultParameter(a: number, b: string, c = true, d = Date.now()): void {
        // empty
    }
}


describe("Test ClassParser", () => {
    it("Parse test class", async () => {
        const parser = new TypeParser();

        const result = parser.parse(A);

        const a = A;
        console.log(result, a);
    });
});
