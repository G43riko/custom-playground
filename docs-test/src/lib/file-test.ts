import {currentEOL} from "g-shared-library";
import {FunctionTest} from "./function-test";
import {commentRegexp, DOCS_TEST_KEY, utils} from "./utils";

export class FileTest {
    private constructor(
        private readonly tests: FunctionTest[],
    ) {
    }

    public static create(fileContent: string): FileTest | null {
        const commentMath = fileContent.match(commentRegexp); //(.|\n)*?function (\w+)

        if (!commentMath) {
            console.warn("Cannot find comment inside content");

            return null;
        }

        return new FileTest(
            commentMath.map(FunctionTest.create).filter((e) => e),
        );
    }

    public getTextContentForFile(absoluteFilePath: string, useEs = true, forceName?: string): string {
        const pathParts                    = absoluteFilePath.split("\\");
        const realFileName                 = pathParts[pathParts.length - 1];
        const realFileNameWithoutExtension = realFileName.replace(/\.\w+$/, "");
        const name = forceName || `./${realFileNameWithoutExtension}`;
        const esImports = [
            "import { expect } from 'chai'",
            "import 'mocha';",
            `import * as ${DOCS_TEST_KEY} from '${name}';`,
        ];
        const cjsImports = [
            "const { expect } = require('chai')",
            `const ${DOCS_TEST_KEY} = require('${name}');`,
        ];
        const imports = useEs ? esImports : cjsImports;

        return [
            ...imports,
            utils.createDescribe(
                realFileNameWithoutExtension,
                this.tests.map((e) => e.getTexts()),
            ),
        ].join(currentEOL) + currentEOL;
    }
}
