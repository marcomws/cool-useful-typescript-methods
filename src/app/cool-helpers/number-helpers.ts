/**
 * this file is exclusive for number-related and decimal-related functions and logics
 */

/**
 * Picks a number within a range
 * @param [num] number
 * @param [min] number range minimum
 * @param [max] number range maximum
 * @returns num if within the range, else returns min or max
 */
export const PICK_NUMBER_WITHIN_RANGE = (
  num: number = 0,
  min: number = 0,
  max: number = 0
): number => {
  return Math.min(Math.max(num, min), max);
};

/**
 * Gets decimal-digits length
 * @param value number
 * @param [minDecimalDigits] number range minimum
 * @param [maxDecimalDigits] number range maximum
 * @param [separator] decimal separator char
 * @returns decimal-digits length if within the range, else returns min or max
 */
export const GET_DECIMAL_DIGITS_LENGTH = (
  value: any,
  minDecimalDigits: number = 2,
  maxDecimalDigits: number = 4,
  separator: string = "."
): number => {
  let digits: any[];
  let hasDecimals: boolean;
  let decimalLen: number;
  if (value) {
    digits = value.toString().split(separator);
    hasDecimals = digits.length === 2;
    decimalLen = hasDecimals ? digits[1].length : 0;
  } else {
    return minDecimalDigits;
  }

  return PICK_NUMBER_WITHIN_RANGE(
    decimalLen,
    minDecimalDigits,
    maxDecimalDigits
  );
};

/**
 * Angular-like DecimalPipe
 * @param value number
 * @param [minDecimalDigits] number range minimum
 * @param [maxDecimalDigits] number range maximum
 * @param [separator] decimal separator char
 * @returns decimal number with decimal-digits length within the range
 */
export const ANGULAR_LIKE_DECIMALPIPE = (
  value: any,
  minDecimalDigits: number = 2,
  maxDecimalDigits: number = 4,
  separator: string = "."
): string => {
  if (value) {
    const fixedIndex = GET_DECIMAL_DIGITS_LENGTH(
      value,
      minDecimalDigits,
      maxDecimalDigits,
      separator
    );
    const parsedToFixed = parseFloat(value).toFixed(fixedIndex);
    return parsedToFixed;
  }
  return "0";
};
