import { AfterGroupingEnum, SortingOrderEnum } from "./enums";

export class GroupingPredicate<T> {
  groupField: keyof T;
  fn?: (args: any) => any;
  groupingName?: string;
  subListName?: string;
  afterGrouping?: AfterGroupingEnum;
  thenGroupBy?: GroupingPredicate<T>;
  thenOrderBy?: SortingPredicate<T>;
}

export class SortingPredicate<T> {
  sortField: keyof T;
  order?: SortingOrderEnum;
  fn?: (args: any) => any;
  thenBy?: SortingPredicate<T>;
}
