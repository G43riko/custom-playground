export enum Operator {
    TYPEOF     = "typeof",
    EQUAL      = "=>",
    DEEP_EQUAL = "==>",
}

export function parseOperator(operator: string): Operator {
    switch (operator) {
        case Operator.DEEP_EQUAL:
            return Operator.DEEP_EQUAL;
        case Operator.EQUAL:
            return Operator.EQUAL;
        case Operator.TYPEOF:
            return Operator.TYPEOF;
        default:
            throw new Error("Unknown operator " + operator);
    }
}

export function stringifyOperator(operator: Operator) {
    switch (operator) {
        case Operator.DEEP_EQUAL:
            return "to.deep.equal";
        case Operator.EQUAL:
            return "to.be.equal";
        case Operator.TYPEOF:
            return "to.be.an";
        default:
            throw new Error("Unknown operator " + operator);
    }
}
