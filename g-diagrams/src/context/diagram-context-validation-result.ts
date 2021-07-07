export interface DiagramContextValidationResult {
    readonly resultCode: "SUCCESS" | "ERROR" | "WARNING";
    readonly errors?: {
        readonly message: string;
    }[];
    readonly warnings?: {
        readonly message: string;
    }[];
}

export class DiagramContextValidationResultInstance {
    private readonly holder: DiagramContextValidationResult = {
        resultCode: "SUCCESS",
        errors    : [],
        warnings  : [],
    }

    public addError(error: string): this {
        this.holder.errors?.push({message: error});

        return this;
    }

    public addValidationResult(result: DiagramContextValidationResult): void {
        if (result.resultCode === "ERROR") {
            (this.holder.resultCode as any) = "ERROR";
        }

        if (result.errors) {
            this.holder.errors?.push(...result.errors);
        }

        if (result.warnings) {
            this.holder.warnings?.push(...result.warnings);
        }
    }

    public getResult(): DiagramContextValidationResult {
        return {
            resultCode: this.holder.resultCode === "ERROR" || this.holder.errors?.length ? "ERROR" : "SUCCESS",
            errors    : this.holder.errors,
            warnings  : this.holder.warnings,
        };
    }

    public addWarning(error: string): this {
        this.holder.warnings?.push({message: error});

        return this;
    }
}
