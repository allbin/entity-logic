import { DateTime } from 'luxon';

import { EntitySchemaPropType } from './schema';

export type FilterOperator =
  | 'known'
  | 'unknown'
  | 'true'
  | 'false'
  | 'eq'
  | 'neq'
  | 'one_of'
  | 'none_of'
  | 'matches'
  | 'not_matches'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'between'
  | 'not_between'
  | 'before'
  | 'after'
  | 'includes_all_of'
  | 'includes_any_of'
  | 'includes_none_of';

export type FilterValue =
  | undefined
  | number
  | string
  | boolean
  | DateTime
  | string[]
  | number[]
  | DateTime[];

interface FilterConditionBase {
  field: string;
  propType: EntitySchemaPropType;
  operator: FilterOperator;
  value?: FilterValue;
}

interface FilterConditionStringNoArgs extends FilterConditionBase {
  propType: 'string';
  operator: 'known' | 'unknown';
}

interface FilterConditionStringSingleArg extends FilterConditionBase {
  propType: 'string';
  operator: 'eq' | 'neq' | 'matches' | 'not_matches';
  value: string;
}

interface FilterConditionStringManyArgs extends FilterConditionBase {
  propType: 'string';
  operator: 'one_of' | 'none_of';
  value: string[];
}

type FilterConditionString =
  | FilterConditionStringNoArgs
  | FilterConditionStringSingleArg
  | FilterConditionStringManyArgs;

interface FilterConditionEnumNoArgs extends FilterConditionBase {
  propType: 'enum';
  operator: 'known' | 'unknown';
}

interface FilterConditionEnumSingleArg extends FilterConditionBase {
  propType: 'enum';
  operator: 'eq' | 'neq' | 'matches' | 'not_matches';
  value: string;
}

interface FilterConditionEnumManyArgs extends FilterConditionBase {
  propType: 'enum';
  operator: 'one_of' | 'none_of';
  value: string[];
}

type FilterConditionEnum =
  | FilterConditionEnumNoArgs
  | FilterConditionEnumSingleArg
  | FilterConditionEnumManyArgs;

interface FilterConditionNumberNoArgs extends FilterConditionBase {
  propType: 'number';
  operator: 'known' | 'unknown';
}

interface FilterConditionNumberSingleArg extends FilterConditionBase {
  propType: 'number';
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte';
  value: number;
}

interface FilterConditionNumberManyArgs extends FilterConditionBase {
  propType: 'number';
  operator: 'between' | 'not_between';
  value: number[];
}

type FilterConditionNumber =
  | FilterConditionNumberNoArgs
  | FilterConditionNumberSingleArg
  | FilterConditionNumberManyArgs;

interface FilterConditionBooleanNoArg extends FilterConditionBase {
  propType: 'boolean';
  operator: 'known' | 'unknown' | 'true' | 'false';
}

type FilterConditionBoolean = FilterConditionBooleanNoArg;

interface FilterConditionDateTimeNoArgs extends FilterConditionBase {
  propType: 'date';
  operator: 'known' | 'unknown';
}

interface FilterConditionDateTimeSingleArg extends FilterConditionBase {
  propType: 'date';
  operator: 'before' | 'after';
  value: DateTime;
}

interface FilterConditionDateTimeManyArgs extends FilterConditionBase {
  propType: 'date';
  operator: 'between' | 'not_between';
  value: DateTime[];
}

type FilterConditionDateTime =
  | FilterConditionDateTimeNoArgs
  | FilterConditionDateTimeSingleArg
  | FilterConditionDateTimeManyArgs;

interface FilterConditionPhotoNoArg extends FilterConditionBase {
  propType: 'photo';
  operator: 'known' | 'unknown';
}

type FilterConditionPhoto = FilterConditionPhotoNoArg;

interface FilterConditionStringArrayNoArgs extends FilterConditionBase {
  propType: 'array:string';
  operator: 'known' | 'unknown';
}

interface FilterConditionStringArrayManyArgs extends FilterConditionBase {
  propType: 'array:string';
  operator: 'includes_none_of' | 'includes_any_of' | 'includes_all_of';
  value: string[];
}

type FilterConditionStringArray =
  | FilterConditionStringArrayNoArgs
  | FilterConditionStringArrayManyArgs;

interface FilterConditionNumberArrayNoArgs extends FilterConditionBase {
  propType: 'array:number';
  operator: 'known' | 'unknown';
}

interface FilterConditionNumberArrayManyArgs extends FilterConditionBase {
  propType: 'array:number';
  operator: 'includes_none_of' | 'includes_any_of' | 'includes_all_of';
  value: number[];
}

type FilterConditionNumberArray =
  | FilterConditionNumberArrayNoArgs
  | FilterConditionNumberArrayManyArgs;

export type FilterCondition =
  | FilterConditionBoolean
  | FilterConditionNumber
  | FilterConditionString
  | FilterConditionEnum
  | FilterConditionDateTime
  | FilterConditionPhoto
  | FilterConditionStringArray
  | FilterConditionNumberArray;

export type Filter = FilterCondition[];
