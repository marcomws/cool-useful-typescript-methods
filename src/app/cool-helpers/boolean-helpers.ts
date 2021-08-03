/**
 * this file is exclusive for boolean-related functions
 */

/**
 * XOR GATE
 * @param a boolean
 * @param b boolean
 * @returns a XOR b
 */
export const ARE_DIFFERENT_BOOLEANS = (a: boolean, b: boolean): boolean =>
  (a && !b) || (!a && b);

/**
 * XNOR GATE
 * @param a boolean
 * @param b boolean
 * @returns a XNOR b
 */
export const ARE_EQUAL_BOOLEANS = (a: boolean, b: boolean): boolean =>
  (a && b) || (!a && !b);

/**
 * reverse logic based on a condition
 * @param logic boolean
 * @param reverseCondition boolean
 * @returns logic XOR reverseCondition
 */
export const REVERSE_LOGIC = (
  logic: boolean,
  reverseCondition: boolean
): boolean => ARE_DIFFERENT_BOOLEANS(logic, reverseCondition);

/**
 * stick to logic based on a condition
 * @param logic boolean
 * @param upholdCondition boolean
 * @returns logic XNOR upholdCondition
 */
export const UPHOLD_LOGIC = (
  logic: boolean,
  upholdCondition: boolean
): boolean => ARE_EQUAL_BOOLEANS(logic, upholdCondition);
