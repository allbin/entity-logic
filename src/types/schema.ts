import { DateTime } from 'luxon';

export type EntitySchema = {
  /**
   * Array of EntitySchemaGroups
   */
  groups: Array<EntitySchemaGroup>;
  /**
   * Array of EntitySchemaProps
   */
  properties: Array<EntitySchemaProp>;
};

export type EntitySchemaPropsByKey = Record<string, EntitySchemaProp>;

type EntitySchemaGroup = {
  /**
   * Group ID
   */
  id: number;
  /**
   * Group name
   */
  name: string;
};

/**
 * Schema property types
 */
export type EntitySchemaPropType =
  | 'array:number'
  | 'array:string'
  | 'boolean'
  | 'date'
  | 'enum'
  | 'number'
  | 'photo'
  | 'string';

export type EntitySchemaPropValue =
  | undefined
  | boolean
  | number
  | string
  | DateTime
  | number[]
  | string[];

export type EntitySchemaProp = {
  /**
   * Property key
   */
  key: string;
  /**
   * Property type
   */
  type: EntitySchemaPropType;
  /**
   * Property display name
   */
  name: string;
  /**
   * Reference to EntitySchemaGroup of which this property is a member
   */
  group_id?: number;
  /**
   * Flag set to true if property may be modified by users
   */
  modifiable?: boolean;
  /**
   * If property type is enum, this field must exist and contain a list of acceptable values
   */
  alternatives?: Array<string>;
};

export type Entity<T = unknown> = T & {
  properties: Record<string, EntitySchemaPropValue>;
};
