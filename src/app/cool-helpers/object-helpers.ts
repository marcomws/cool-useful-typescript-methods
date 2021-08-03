/**
 * this file is exclusive for object-related and array-related functions and logics
 */

import { AfterGroupingEnum, CustomSortingCriteria, SortingOrderEnum } from "./common/enums";
import { GroupingPredicate, SortingPredicate } from "./common/models";

/**
 * Helpful for checking the property name spilling
 * @param key property name to check
 * @returns property name for the type specified by the generic argument
 */
export const PROPERTY_OF = <T>(key: keyof T) => key;

/**
 * stringify object and it"s values
 * @param o object or any
 * @returns stringified object
 */
export const STRINGIFY_OBJECT = (o: any) => {
  Object.keys(o).forEach(k => {
    if (typeof o[k] === "object") {
      return STRINGIFY_OBJECT(o[k]);
    }
    o[k] = "" + o[k];
  });
  return o;
};

/**
 * removes duplicates from generic array
 * @param arr generic array
 * @param [condition] custom condition
 * @returns array without duplicates
 *
 * @example // complex array example
 * REMOVECONDITIONALDUPLICATES(arr, (a, b) => {
 *      if (a[key]) { return a[key] === b[key]; }
 *      else return a === b;
 * });
 */
export const REMOVE_CONDITIONAL_DUPLICATES = <T>(
  arr: T[],
  condition?: (a: T, b: T) => boolean
): T[] => {
  if (arr && arr.length > 0) {
    return arr.reduce(
      (unique: T[], a: T) =>
        unique.findIndex(b => (condition ? condition(a, b) : a === b)) > -1
          ? unique
          : [...unique, a],
      []
    );
  } else {
    return [];
  }
}

/**
 * Inspired by LinQ firstOrDefault method
 * @param arr generic array
 * @param [condition] custom condition
 * @returns default item, else first one
 */
export const FIRST_OR_DEFAULT = <T extends { isDefault?: boolean }>(
  arr: T[],
  condition?: (item: T) => boolean
): T => {
  if (arr?.length > 0) {
      const firstMatch = arr.find((item) => (condition ? condition(item) : item.isDefault));
      return firstMatch || arr[0];
  }

  return undefined;
}

/**
 * Inspired by LinQ singleOrDefault method
 * @param arr generic array
 * @param [condition] custom condition
 * @returns only unique default single item, else undefined
 */
export const SINGLE_OR_DEFAULT = <T extends { isDefault?: boolean }>(
  arr: T[],
  condition?: (item: T) => boolean
): T => {
  if (arr?.length > 0) {
      const matches = arr.filter((item) => (condition ? condition(item) : item.isDefault));
      if (matches?.length === 1) {
          return matches[0];
      }
  }

  return undefined;
}

/**
 * Groups elements of a sequence by a specified field
 * @param data Sequence of values to group
 * @param params Grouping predicate(s)
 * @returns Grouped elements according to a predicate(s) for the type specified by the generic argument
 */
export const GROUP_BY = <T>(data: T[], params: GroupingPredicate<T>): any[] => {
  const groups = data.reduce((subGroup, item) => {
    const field = params.fn
      ? params.fn(item[params.groupField])
      : item[params.groupField];

    if (!subGroup[field]) {
      subGroup[field] = [];
    }

    if (params.afterGrouping === AfterGroupingEnum.DELETE_GROUP_FIELD) {
      delete item[params.groupField];
    }

    subGroup[field].push(item);

    return subGroup;
  }, {});

  const result: any[] = Object.keys(groups).map(value => {
    const subList = params.thenGroupBy
    ? GROUP_BY(groups[value], params.thenGroupBy)
    : params.thenOrderBy
      ? ORDER_BY(groups[value], params.thenOrderBy)
      : groups[value];
      
    return {
      [params.groupingName || params.groupField]: value,
      [params.subListName || "subList"]: subList
    };
  });

  return result;
};

/**
 * Sorts the elements of a sequence in ascending or descending order according to a predicate(s)
 * Inspired by LinQ OrderBy method
 * @param data Sequence of values to order
 * @param params Sorting predicate(s)
 * @returns Sorted elements according to a predicate(s) for the type specified by the generic argument
 */
export const ORDER_BY = <T>(data: T[], params: SortingPredicate<T>): T[] => {
  return data.sort((a, b) => COMPARE_FN<T>(params, a, b));
};

/**
 * Default sorting comparer between two objects (generic)
 * @param sp Sorting predicate(s)
 * @param a first object (generic)
 * @param b second object (generic)
 * @returns Default sort order comparer for the type specified by the generic argument
 */
export const COMPARE_FN = <T>(sp: SortingPredicate<T>, a: T, b: T): number => {
  if (sp && sp.sortField) {
    const orderValue = sp.order || SortingOrderEnum.ASCENDING;
    const key = (o: T) => (sp.fn ? sp.fn(o[sp.sortField]) : o[sp.sortField]);
    const keyA = key(a);
    const keyB = key(b);

    if (keyA > keyB) {
      return orderValue;
    }
    if (keyA < keyB) {
      return -1 * orderValue;
    }
    return COMPARE_FN<T>(sp.thenBy, a, b);
  } else {
    return 0;
  }
};

/**
 * custom sorting order example
 * @param prop property to check
 * @param specific specific obj with specific order
 * @param specificKey prop name to check of the specific obj
 * @returns index number for sorting
 *
 * @example // complex array example
 * orderBy<T>(
 +   array,
 +   {
 +     sortField: "age",
 +     order: SortingOrderEnum.ASCENDING,
 +     fn: (age) => GET_CUSTOM_ORDER(age, this.person, "age"),
 +     thenBy: {
 +       sortField: "height",
 +       order: SortingOrderEnum.ASCENDING
 +     }
 +   }
 + );
 */
export const GET_CUSTOM_ORDER = (prop: string, specific: any, specificKey: string): number => {
  const isSpecificOrCustom = prop in CustomSortingCriteria;
  const isSpecific = specific[specificKey] == prop;

  return isSpecificOrCustom
      ? CustomSortingCriteria[prop]
      : isSpecific
          ? CustomSortingCriteria.KEY_SPECIFIC
          : CustomSortingCriteria.KEY_OTHER;
}