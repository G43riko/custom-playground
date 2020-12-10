export declare enum Operator {
    TYPEOF     = "typeof",
    EQUAL      = "=>",
    DEEP_EQUAL = "==>"
}

export declare function parseOperator(operator: string): Operator;

export declare function stringifyOperator(operator: Operator): "to.deep.equal" | "to.be.equal" | "to.be.an";
