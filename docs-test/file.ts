const accentedLowerCharacters = "ąàáäâãåæăćčĉďęèéëêĝĥìíïîĵłľńňòóöőôõðøśșşšŝťțţŭùúüűûñÿýçżźž";
const normalLowerCharacters   = "aaaaaaaaacccdeeeeeghiiiijllnnoooooooossssstttuuuuuunyyczzz";
const accentedCharacters      = accentedLowerCharacters + accentedLowerCharacters.toUpperCase();
const normalCharacters        = normalLowerCharacters + normalLowerCharacters.toUpperCase();

/* TODO:
    static underscore(word) {
    }
    static humanize(word) {
    }
    static dasherize(word) {
    }
    //dashCase = a-b-c-d-e
    //dotCase a.c.d.v.s.d
    //pascalCase = FooBarBaz
    //pathCase = a/b/c/d
    //snakeCase = a_b_c_d_
    static isUpper(word) {
    }
    static isLower(word) {
    }
*/

export function removeAccentedCharacters(word: string): string {
    if (!word || !word.replace) {
        return word;
    }

    return word.replace(/./g, (e: string) => {
        const index = accentedCharacters.indexOf(e);

        return index >= 0 ? normalCharacters[index] : e;
    });
}

/**
 * @example
 *  cutUsing("abcdefghij", 10) => abcdefghij
 *  cutUsing("abcdefghij", 15) => abcdefghij
 *  cutUsing("abcdefghij", 9) => abcdefg...
 *  cutUsing("abcdefghij", 9, "...", false) => abcdefghi...
 */
export function cutUsing(text: string, maxLength: number, suffix = "...", lengthIncludeSuffix = true): string {
    if (text.length <= maxLength) {
        return text;
    }

    return text.substr(0, maxLength - (lengthIncludeSuffix ? suffix.length - 1 : 0)) + suffix;
}


/**
 * @example
 *  capitalize("gabo") => Gabo
 *  capitalize("GABO") => Gabo
 *  capitalize("gABO") => Gabo
 */
export function capitalize(text: string): string {
    return text.toLowerCase().replace(/^./, (char) => char.toUpperCase());
}

/**
 * @deprecated use {@link capitalize} instead
 */
export function toCapital(text: string): string {
    return text.replace(/^./, (e) => e.toUpperCase());
}

export function getLastPart(text: string, divider = " "): string {
    if (!text || !text.split) {
        return text;
    }
    const splitText = text.split(divider);

    return splitText[splitText.length - 1];
}

/**
 * @deprecated use {@link occurrences} instead
 */
export function count(text: string, key: string): number {
    return (text.match(new RegExp(key, "g")) || []).length;
}

/**
 * @param text - text need to be repeat
 * @param numberOfRepetitions - number of iterations
 * @deprecated - use {@link String#repeat}
 */
export function repeat(text: string, numberOfRepetitions: number): string {
    return new Array(numberOfRepetitions + 1).join(text);
}

export function removeAll(text: string, words: string[]): string {
    return text.replace(new RegExp(`(${words.join("|")})`, "g"), "");
}

/**
 * @example
 *  template("{{name}} is {{age}} years old", {name: "Gabriel", age: 23}) => Gabriel is 23 years old
 */
export function template(text: string, values: any, start = "{{", end = "}}"): string {
    const updatedStart = start.replace(/[-[\]()*\s]/g, "\\$&").replace(/\$/g, "\\$");
    const updatedEnd   = end.replace(/[-[\]()*\s]/g, "\\$&").replace(/\$/g, "\\$");

    return text.replace(
        new RegExp(`${updatedStart}(.+?)${updatedEnd}`, "g"),
        (math, key) => String(values[key]),
    );
}

export function removeEmptyLines(content: string): string {
    return content.replace(/^\s*$(?:\r\n?|\n)/gm, "");
}

/**
 * @example
 *  between("my name is gabriel and I am 26 years old", "NAME", "gabriel") => "my name is "
 *  between("my name is gabriel and I am 26 years old", "name", "GABRIEL") => " is gabriel and I am 26 years old"
 *  between("my name is gabriel and I am 26 years old", "name", "gabriel") => " is "
 *  between("my name is gabriel and I am 26 years old", "name", "gabriel", true) => "is"
 */
export function between(text: string, key1: string, key2: string, trim = false): string {
    const processResult = (result: string) => trim ? result.trim() : result;

    const startPos = text.indexOf(key1);
    const endPos   = text.indexOf(key2);
    if (startPos < 0 && endPos >= 0) {
        return processResult(text.substring(0, endPos));
    }

    if (endPos < 0 && startPos >= 0) {
        return processResult(text.substring(startPos + key1.length, text.length));
    }

    return processResult(text.substring(startPos + key1.length, endPos));
}

/**
 * Returns number of occurrences of substring
 * @version 0.2.40 - much faster then previous regex method using `return (text.match(new RegExp(key, "g")) || []).length;`
 * @example
 *  occurrences("foofoofoo", "bar"); => 0
 *  occurrences("foofoofoo", "foo"); => 3
 *  occurrences("foofoofoo", "foofoo"); => 1
 *  occurrences("foofoofoo", "foofoo", true); => 2
 * @param text - text
 * @param key - searched substring
 * @param overlapping - allows math overlapping
 */
export function occurrences(text: string, key: string, overlapping = false): number {
    let index   = text.indexOf(key);
    let counter = 0;
    const step  = overlapping ? 1 : key.length;
    while (index >= 0) {
        counter++;
        index = text.indexOf(key, index + step);
    }

    return counter;
}

export function collapseWhitespace(text: string): string {
    return text.replace(/[\s\uFEFF\xA0]{2,}/g, " ");
}

export function swapCase(text: string): string {
    return text.replace(/\S/g, (char) => {
        const lowerCase = char.toLowerCase();

        return lowerCase === char ? char.toUpperCase() : lowerCase;
    });
}

/**
 * @example
 *  format("{} is a big {}", ["Gabo", "hero"]) => Gabo is a big hero
 *  format("<> is a big <>", ["Gabo", "hero"], "<>") => Gabo is a big hero
 */
export function format(text: string, values: string[], placeHolder = "{}"): string {
    const result: string[] = [];
    let lastIndex;
    let actualIndex        = 0;
    let counter            = 0;

    while (counter < values.length) {
        lastIndex   = actualIndex;
        actualIndex = text.indexOf(placeHolder, actualIndex);
        result.push(text.substring(lastIndex, actualIndex));
        result.push(values[counter++]);
        actualIndex += placeHolder.length;
    }
    result.push(text.substring(actualIndex));

    return result.join("");
}

export function transformToBasicFormat(text: string): string {
    return collapseWhitespace(removeAccentedCharacters(text).toLowerCase()).trim();
}

/**
 * @example
 *  getAsciiArray("abcdefg") ==> [97, 98, 99, 100, 101, 102, 103]
 * @param thisArg
 */
export function getAsciiArray(thisArg: string): number[] {
    const result = [];
    for (const letter of thisArg) {
        result[result.length] = letter.charCodeAt(0);
    }

    return result;
}

export function toBasicForm(text: string): string {
    return removeAccentedCharacters(text.toLowerCase());
}

export function contains(text: string, substring: string): boolean {
    return !!text && removeAccentedCharacters(text.toLowerCase()).indexOf(substring) >= 0;
}

/**
 * @example
 *  joinSingle("package", ".", "json") => package.json
 *  joinSingle("package.", ".", "json") => package.json
 *  joinSingle("package", ".", ".json") => package.json
 *  joinSingle("package.", ".", ".json") => package.json
 */
export function joinSingle(prefix: string, divider: string, postfix: string): string {
    if (postfix.startsWith(divider) && prefix.endsWith(divider)) {
        return prefix + postfix.substring(divider.length);
    }

    if (postfix.startsWith(divider) || prefix.endsWith(divider)) {
        return prefix + postfix;
    }

    return prefix + divider + postfix;
}

/**
 * @deprecated use {@link join} instead
 * @param data - data to join
 * @param delimiter - delimiter
 * @param prefix - prefix
 * @param postfix - postfix
 */
export function joinString(data: string[], delimiter = " ", prefix = "", postfix = ""): string {
    return prefix + data.join(delimiter) + postfix
}

export function getFormattedNumber(num: string, prefix = "+421"): string {
    num = num.replace(/[( )/-]/g, "");
    if (num.startsWith("+")) {
        return num;
    }
    if (num.startsWith("00")) {
        return num.substring(2);
    }
    if (num.startsWith("09") || num.startsWith("02")) {
        return prefix + num.substring(1);
    }

    return num;
}

export function fuzzy_match_simple(pattern: string, str: string): boolean {
    let patternIdx      = 0;
    let strIdx          = 0;
    const patternLength = pattern.length;
    const strLength     = str.length;

    while (patternIdx !== patternLength && strIdx !== strLength) {
        const patternChar = pattern.charAt(patternIdx)
                                   .toLowerCase();
        const strChar     = str.charAt(strIdx)
                               .toLowerCase();
        if (patternChar === strChar) {
            ++patternIdx;
        }
        ++strIdx;
    }

    return patternLength !== 0 && strLength !== 0 && patternIdx === patternLength;
}

export function replaceForAll(content: string, values: string[], placeHolder: string): string[] {
    return values.map((value) => content.replace(placeHolder, value));
}
