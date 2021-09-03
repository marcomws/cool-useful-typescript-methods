/**
 * this file is exclusive for string-related functions and logics
 */

import { SEGMENTATION_DELIMITER_PREFIX, SEGMENTATION_DELIMITER_SUFFIX } from "./common/constants";
import { CustomFindEnum, CustomReplaceEnum } from "./common/enums";

/**
 * Returns a section of a string
 * @param str string
 * @param nDigits keys to find and replace
 * @returns a section of a string 
 */
export const LAST_N_DIGITS = (str: string, nDigits: number) => str.slice(str.length - nDigits);

/**
 * fll anything with anything in both positions
 * @param anything string, number or array
 * @param length filling length
 * @param [position] filling position
 * @param [fill] char, number or string
 * @returns string or array filled as specified
 */
export const PAD_WITH_ANY = (
  anything: any,
  length: number,
  position: "before" | "after" = "before",
  fill: any = 0
) => {
  let result: any,
    inputType = typeof anything;

  if (inputType == "number") {
    anything = anything.toString();
  }

  if (position == "before") {
    result = [...new Array(length).fill(fill), ...Array.from(anything)];
  } else {
    result = [...Array.from(anything), ...new Array(length).fill(fill)];
  }

  if (inputType == "string" || inputType == "number") {
    return result.join("");
  }

  return result;
};

/**
 * Trim long string
 * @param text string
 * @param maxLength number
 * @param [ellipsis] suffix
 * @param [wordTruncate] whether or not to truncate into words
 * @param [delimiter] char or string
 * @returns shortend text within maxLength
 */
export const SHORTEND_LONG_TEXT = (
  text: string,
  maxLength: number,
  ellipsis: "ellipsis" | boolean = false,
  wordTruncate: "wordTruncate" | boolean = false,
  delimiter = " "
): string => {
  const suffix = ellipsis ? "\u2026" : "";
  if (text) {
    text = text.trim();
    if (text.length <= maxLength) {
      return text;
    }
    if (wordTruncate) {
      return text.substr(0, maxLength).trim() + suffix;
    }
    return (
      text.substr(0, text.lastIndexOf(delimiter, maxLength)).trim() + suffix
    );
  } else {
    return "";
  }
};

/**
 * segmentate a string into a more identifiable one
 * @example
 * from: some_text <find_key_1> some_text <find_key_2> some_text
 * to: some_text <prefix><replace_key_1><suffix> some_text <prefix><replace_key_2><suffix> some_text
 *
 * @param flawStr flawed string
 * @param findStrs keys to find and replace
 * @param [prefix] replacement prefix
 * @param [suffix] replacement suffix
 * @returns identifiable segmented string
 */
 export const STRING_SEGMENTATION = (
  flawStr: string,
  findStrs: CustomFindEnum[],
  prefix: string = SEGMENTATION_DELIMITER_PREFIX,
  suffix: string = SEGMENTATION_DELIMITER_SUFFIX
): string => {
  if (!flawStr || flawStr === "" || findStrs?.length === 0) {
      return flawStr;
  }

  let segmentation: string = flawStr;
  findStrs?.forEach((transKey) => {
    const wordBoundary = new RegExp(`\\b${transKey?.toString()}\\b`, "g");
    segmentation = segmentation
      .split(wordBoundary)
      .join(
        prefix +
        CustomReplaceEnum[CustomFindEnum[transKey]] +
        suffix
      );
    });

  return segmentation;
}