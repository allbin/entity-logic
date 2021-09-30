import { DateTime } from 'luxon';

import { Entity, EntitySchemaPropType } from './types/schema';

type EntityFilterFunction = (entity: Entity, prop_val: any) => boolean;

interface Operator {
  params: EntitySchemaPropType[];
  func: (field: string, ...args: any[]) => EntityFilterFunction;
}

type OperatorFunctions = Record<EntitySchemaPropType, Record<string, Operator>>;

const escapeAndCompileRegex = (s: string): RegExp =>
  new RegExp(
    String(s)
      .replace(/([-()[\]{}+?*.$^|,:#<!\\])/g, '\\$1')
      // eslint-disable-next-line
      .replace(/\x08/g, '\\x08')
      .replace(/\\\*/g, '.*'),
    'i',
  );

const operators: OperatorFunctions = {
  boolean: {
    known: {
      params: [],
      func: (field) => (entity) =>
        Object.prototype.hasOwnProperty.call(entity.properties, field) &&
        entity.properties[field] !== undefined &&
        entity.properties[field] !== null,
    },
    unknown: {
      params: [],
      func: (field) => (entity) =>
        !Object.prototype.hasOwnProperty.call(entity.properties, field) ||
        entity.properties[field] === undefined ||
        entity.properties[field] === null,
    },
    true: {
      params: [],
      func: () => (entity, prop_val) => prop_val === true,
    },
    false: {
      params: [],
      func: () => (entity, prop_val) => prop_val === false,
    },
  },
  number: {
    known: {
      params: [],
      func: (field) => (entity) =>
        Object.prototype.hasOwnProperty.call(entity.properties, field) &&
        entity.properties[field] !== undefined &&
        entity.properties[field] !== null,
    },
    unknown: {
      params: [],
      func: (field) => (entity) =>
        !Object.prototype.hasOwnProperty.call(entity.properties, field) ||
        entity.properties[field] === undefined ||
        entity.properties[field] === null,
    },
    eq: {
      params: ['number'],
      func: (field, val) => (entity, prop_val) =>
        typeof prop_val === 'number' && prop_val === val,
    },
    neq: {
      params: ['number'],
      func: (field, val) => (entity, prop_val) =>
        typeof prop_val === 'number' && prop_val !== val,
    },
    gt: {
      params: ['number'],
      func: (field, val) => (entity, prop_val) =>
        typeof prop_val === 'number' &&
        typeof val === 'number' &&
        prop_val > val,
    },
    gte: {
      params: ['number'],
      func: (field, val) => (entity, prop_val) =>
        typeof prop_val === 'number' &&
        typeof val === 'number' &&
        prop_val >= val,
    },
    lt: {
      params: ['number'],
      func: (field, val) => (entity, prop_val) =>
        typeof prop_val === 'number' &&
        typeof val === 'number' &&
        prop_val < val,
    },
    lte: {
      params: ['number'],
      func: (field, val) => (entity, prop_val) =>
        typeof prop_val === 'number' &&
        typeof val === 'number' &&
        prop_val <= val,
    },
    between: {
      params: ['number', 'number'],
      func:
        (field, [min, max]) =>
        (entity, prop_val) =>
          typeof min === 'number' &&
          typeof max === 'number' &&
          typeof prop_val === 'number' &&
          prop_val >= min &&
          prop_val <= max,
    },
    not_between: {
      params: ['number', 'number'],
      func:
        (field, [min, max]) =>
        (entity, prop_val) =>
          typeof min == 'number' &&
          typeof max === 'number' &&
          typeof prop_val === 'number' &&
          (prop_val < min || prop_val > max),
    },
  },
  string: {
    known: {
      params: [],
      func: (field) => (entity) =>
        Object.prototype.hasOwnProperty.call(entity.properties, field) &&
        entity.properties[field] !== undefined &&
        entity.properties[field] !== null,
    },
    unknown: {
      params: [],
      func: (field) => (entity) =>
        !Object.prototype.hasOwnProperty.call(entity.properties, field) ||
        entity.properties[field] === undefined ||
        entity.properties[field] === null,
    },
    eq: {
      params: ['string'],
      func: (field, val) => (entity, prop_val) =>
        typeof prop_val === 'string' && prop_val === val,
    },
    neq: {
      params: ['string'],
      func: (field, val) => (entity, prop_val) =>
        typeof prop_val === 'string' && prop_val !== val,
    },
    matches: {
      params: ['string'],
      func: (field, val) => (entity, prop_val) =>
        typeof prop_val === 'string' &&
        typeof val === 'string' &&
        escapeAndCompileRegex(val).test(prop_val),
    },
    not_matches: {
      params: ['string'],
      func: (field, val) => (entity, prop_val) =>
        typeof prop_val === 'string' &&
        typeof val === 'string' &&
        !escapeAndCompileRegex(val).test(prop_val),
    },
    one_of: {
      params: ['array:string'],
      func: (field, vals) => (entity, prop_val) =>
        Array.isArray(vals) &&
        typeof prop_val === 'string' &&
        vals.find(
          (v) =>
            typeof v === 'string' && v.toLowerCase() === prop_val.toLowerCase(),
        ) !== undefined,
    },
    none_of: {
      params: ['array:string'],
      func: (field, vals) => (entity, prop_val) =>
        Array.isArray(vals) &&
        typeof prop_val === 'string' &&
        vals.find(
          (v) =>
            typeof v === 'string' && v.toLowerCase() === prop_val.toLowerCase(),
        ) === undefined,
    },
  },
  enum: {
    known: {
      params: [],
      func: (field) => (entity) =>
        Object.prototype.hasOwnProperty.call(entity.properties, field) &&
        entity.properties[field] !== undefined &&
        entity.properties[field] !== null,
    },
    unknown: {
      params: [],
      func: (field) => (entity) =>
        !Object.prototype.hasOwnProperty.call(entity.properties, field) ||
        entity.properties[field] === undefined ||
        entity.properties[field] === null,
    },
    eq: {
      params: ['string'],
      func: (field, val) => (entity, prop_val) =>
        typeof prop_val === 'string' && prop_val === val,
    },
    neq: {
      params: ['string'],
      func: (field, val) => (entity, prop_val) =>
        typeof prop_val === 'string' && prop_val !== val,
    },
    matches: {
      params: ['string'],
      func: (field, val) => (entity, prop_val) =>
        typeof prop_val === 'string' &&
        typeof val === 'string' &&
        escapeAndCompileRegex(val).test(prop_val),
    },
    not_matches: {
      params: ['string'],
      func: (field, val) => (entity, prop_val) =>
        typeof prop_val === 'string' &&
        typeof val === 'string' &&
        !escapeAndCompileRegex(val).test(prop_val),
    },
    one_of: {
      params: ['array:string'],
      func: (field, vals) => (entity, prop_val) =>
        Array.isArray(vals) &&
        typeof prop_val === 'string' &&
        vals.includes(prop_val),
    },
    none_of: {
      params: ['array:string'],
      func: (field, vals) => (entity, prop_val) =>
        Array.isArray(vals) &&
        typeof prop_val === 'string' &&
        !vals.includes(prop_val),
    },
  },
  date: {
    known: {
      params: [],
      func: (field) => (entity) =>
        Object.prototype.hasOwnProperty.call(entity.properties, field) &&
        entity.properties[field] !== undefined &&
        entity.properties[field] !== null,
    },
    unknown: {
      params: [],
      func: (field) => (entity) =>
        !Object.prototype.hasOwnProperty.call(entity.properties, field) ||
        entity.properties[field] === undefined ||
        entity.properties[field] === null,
    },
    before: {
      params: ['date'],
      func: (field, at) => (entity, prop_val) =>
        DateTime.isDateTime(at) &&
        DateTime.isDateTime(prop_val) &&
        prop_val < at,
    },
    after: {
      params: ['date'],
      func: (field, at) => (entity, prop_val) =>
        DateTime.isDateTime(at) &&
        DateTime.isDateTime(prop_val) &&
        prop_val > at,
    },
    between: {
      params: ['date', 'date'],
      func:
        (field, [from, to]) =>
        (entity, prop_val) =>
          DateTime.isDateTime(from) &&
          DateTime.isDateTime(to) &&
          DateTime.isDateTime(prop_val) &&
          prop_val >= from &&
          prop_val <= to,
    },
    not_between: {
      params: ['date', 'date'],
      func:
        (field, [from, to]) =>
        (entity, prop_val) =>
          DateTime.isDateTime(from) &&
          DateTime.isDateTime(to) &&
          DateTime.isDateTime(prop_val) &&
          (prop_val < from || prop_val > to),
    },
  },
  photo: {
    known: {
      params: [],
      func: (field) => (entity) =>
        Object.prototype.hasOwnProperty.call(entity.properties, field) &&
        entity.properties[field] !== undefined &&
        entity.properties[field] !== null,
    },
    unknown: {
      params: [],
      func: (field) => (entity) =>
        !Object.prototype.hasOwnProperty.call(entity.properties, field) ||
        entity.properties[field] === undefined ||
        entity.properties[field] === null,
    },
  },
  'array:number': {
    known: {
      params: [],
      func: (field) => (entity) =>
        Object.prototype.hasOwnProperty.call(entity.properties, field) &&
        entity.properties[field] !== undefined &&
        entity.properties[field] !== null,
    },
    unknown: {
      params: [],
      func: (field) => (entity) =>
        !Object.prototype.hasOwnProperty.call(entity.properties, field) ||
        entity.properties[field] === undefined ||
        entity.properties[field] === null,
    },
    includes_none_of: {
      params: ['array:number'],
      func: (field, vals) => (entity, prop_vals) =>
        Array.isArray(prop_vals) &&
        Array.isArray(vals) &&
        vals.find((v) => prop_vals.includes(v)) === undefined,
    },
    includes_any_of: {
      params: ['array:number'],
      func: (field, vals) => (entity, prop_vals) =>
        Array.isArray(prop_vals) &&
        Array.isArray(vals) &&
        vals.some((v) => prop_vals.includes(v)),
    },
    includes_all_of: {
      params: ['array:number'],
      func: (field, vals) => (entity, prop_vals) =>
        Array.isArray(prop_vals) &&
        Array.isArray(vals) &&
        vals.every((v) => prop_vals.includes(v)),
    },
  },
  'array:string': {
    known: {
      params: [],
      func: (field) => (entity) =>
        Object.prototype.hasOwnProperty.call(entity.properties, field) &&
        entity.properties[field] !== undefined &&
        entity.properties[field] !== null,
    },
    unknown: {
      params: [],
      func: (field) => (entity) =>
        !Object.prototype.hasOwnProperty.call(entity.properties, field) ||
        entity.properties[field] === undefined ||
        entity.properties[field] === null,
    },
    includes_none_of: {
      params: ['array:string'],
      func: (field, vals) => (entity, prop_vals) =>
        Array.isArray(prop_vals) &&
        Array.isArray(vals) &&
        vals.find((v) => prop_vals.includes(v)) === undefined,
    },
    includes_any_of: {
      params: ['array:string'],
      func: (field, vals) => (entity, prop_vals) =>
        Array.isArray(prop_vals) &&
        Array.isArray(vals) &&
        vals.some((v) => prop_vals.includes(v)),
    },
    includes_all_of: {
      params: ['array:string'],
      func: (field, vals) => (entity, prop_vals) =>
        Array.isArray(prop_vals) &&
        Array.isArray(vals) &&
        vals.every((v) => prop_vals.includes(v)),
    },
  },
};

export default operators;
