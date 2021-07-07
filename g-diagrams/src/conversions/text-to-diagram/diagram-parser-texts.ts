export class DiagramParserTexts {
    public static readonly diagram1         = `
type PersonId = string
--
abstract class AbstractPerson {
    public readonly id: PersonId
    #name: string
    alive = true
    age: number = 0

    public toString(): string
    protected setName(name: string): void
    private setAge(name: number, force = true): void
}`;
    public static readonly classAttributes1 = `
class Person {
    name
    age : number
    readonly SurName;
    favouriteNumbers: number[]
    nickNames:string[];
    gender: string = "unknown"
    middleName?:string
    alias?: String = "none"
    public FavouriteLetter = "g"
    #address: Address;
}
    `;
}
