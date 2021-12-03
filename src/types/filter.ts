import { DateTime } from 'luxon';

import { EntitySchemaPropType } from './schema';

export type FilterOperator =
  | 'known'
  | 'unknown'
  | 'true'
  | 'false'
  | 'eq'
  | 'neq'
  | 'none_of'
  | 'any_of'
  | 'all_of'
  | 'matches'
  | 'not_matches'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'between'
  | 'not_between'
  | 'before'
  | 'after';

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
  type: EntitySchemaPropType;
  operator: FilterOperator;
  value?: FilterValue;
}

export interface FilterConditionStringNoArgs extends FilterConditionBase {
  type: 'string';
  operator: 'known' | 'unknown';
}

export interface FilterConditionStringSingleArg extends FilterConditionBase {
  type: 'string';
  operator: 'eq' | 'neq' | 'matches' | 'not_matches';
  value: string;
}

export interface FilterConditionStringManyArgs extends FilterConditionBase {
  type: 'string';
  operator: 'none_of' | 'any_of';
  value: string[];
}

export type FilterConditionString =
  | FilterConditionStringNoArgs
  | FilterConditionStringSingleArg
  | FilterConditionStringManyArgs;

export interface FilterConditionEnumNoArgs extends FilterConditionBase {
  type: 'enum';
  operator: 'known' | 'unknown';
}

export interface FilterConditionEnumSingleArg extends FilterConditionBase {
  type: 'enum';
  operator: 'eq' | 'neq' | 'matches' | 'not_matches';
  value: string;
}

export interface FilterConditionEnumManyArgs extends FilterConditionBase {
  type: 'enum';
  operator: 'none_of' | 'any_of';
  value: string[];
}

export type FilterConditionEnum =
  | FilterConditionEnumNoArgs
  | FilterConditionEnumSingleArg
  | FilterConditionEnumManyArgs;

export interface FilterConditionNumberNoArgs extends FilterConditionBase {
  type: 'number';
  operator: 'known' | 'unknown';
}

export interface FilterConditionNumberSingleArg extends FilterConditionBase {
  type: 'number';
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte';
  value: number;
}

export interface FilterConditionNumberManyArgs extends FilterConditionBase {
  type: 'number';
  operator: 'between' | 'not_between' | 'none_of' | 'any_of';
  value: number[];
}

export type FilterConditionNumber =
  | FilterConditionNumberNoArgs
  | FilterConditionNumberSingleArg
  | FilterConditionNumberManyArgs;

export interface FilterConditionBooleanNoArg extends FilterConditionBase {
  type: 'boolean';
  operator: 'known' | 'unknown' | 'true' | 'false';
}

export type FilterConditionBoolean = FilterConditionBooleanNoArg;

export interface FilterConditionDateTimeNoArgs extends FilterConditionBase {
  type: 'date';
  operator: 'known' | 'unknown';
}

export interface FilterConditionDateTimeSingleArg extends FilterConditionBase {
  type: 'date';
  operator: 'before' | 'after';
  value: DateTime;
}

export interface FilterConditionDateTimeManyArgs extends FilterConditionBase {
  type: 'date';
  operator: 'between' | 'not_between';
  value: DateTime[];
}

export type FilterConditionDateTime =
  | FilterConditionDateTimeNoArgs
  | FilterConditionDateTimeSingleArg
  | FilterConditionDateTimeManyArgs;

export interface FilterConditionSerializedDateTimeSingleArg
  extends FilterConditionBase {
  type: 'date';
  operator: 'before' | 'after';
  value: string;
}

export interface FilterConditionSerializedDateTimeManyArgs
  extends FilterConditionBase {
  type: 'date';
  operator: 'between' | 'not_between';
  value: string[];
}

export type FilterConditionSerializedDateTime =
  | FilterConditionDateTimeNoArgs
  | FilterConditionSerializedDateTimeSingleArg
  | FilterConditionSerializedDateTimeManyArgs;

export interface FilterConditionPhotoNoArg extends FilterConditionBase {
  type: 'photo';
  operator: 'known' | 'unknown';
}

export type FilterConditionPhoto = FilterConditionPhotoNoArg;

export interface FilterConditionStringArrayNoArgs extends FilterConditionBase {
  type: 'array:string';
  operator: 'known' | 'unknown';
}

export interface FilterConditionStringArrayManyArgs
  extends FilterConditionBase {
  type: 'array:string';
  operator: 'none_of' | 'any_of' | 'all_of';
  value: string[];
}

export type FilterConditionStringArray =
  | FilterConditionStringArrayNoArgs
  | FilterConditionStringArrayManyArgs;

export interface FilterConditionNumberArrayNoArgs extends FilterConditionBase {
  type: 'array:number';
  operator: 'known' | 'unknown';
}

export interface FilterConditionNumberArrayManyArgs
  extends FilterConditionBase {
  type: 'array:number';
  operator: 'none_of' | 'any_of' | 'all_of';
  value: number[];
}

export type FilterConditionNumberArray =
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

export type SerializedFilterCondition =
  | FilterConditionBoolean
  | FilterConditionNumber
  | FilterConditionString
  | FilterConditionEnum
  | FilterConditionSerializedDateTime
  | FilterConditionPhoto
  | FilterConditionStringArray
  | FilterConditionNumberArray;

export type Filter = FilterCondition[];
export type SerializedFilter = SerializedFilterCondition[];
