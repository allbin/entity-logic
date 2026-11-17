import { DateTime, Duration } from 'luxon';

import { Entity, EntitySchemaPropType } from './types/schema';

type EntityFilterFunction = (entity: Entity, prop_val: any) => boolean;
type OperatorFunction = (field: string, ...args: any[]) => EntityFilterFunction;

export interface Operator {
  params: EntitySchemaPropType[];
  func: OperatorFunction;
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

const isCoordinate = (coordinate: unknown): coordinate is number =>
  typeof coordinate === 'number' && !Number.isNaN(coordinate);

export const isCoordinatePair = (point: unknown): point is [number, number] =>
  Array.isArray(point) &&
  point.length === 2 &&
  isCoordinate(point[0]) &&
  isCoordinate(point[1]);

// Distance in coordinate units (degrees for meta.location, ~0.1 mm) within
// which a point counts as lying on a polygon edge. Exact float equality would
// miss most edge points.
const BOUNDARY_TOLERANCE = 1e-9;

const isOnSegment = (
  x: number,
  y: number,
  xi: number,
  yi: number,
  xj: number,
  yj: number,
): boolean => {
  const dx = xj - xi;
  const dy = yj - yi;
  const cross = (x - xi) * dy - (y - yi) * dx;
  const tolerance = BOUNDARY_TOLERANCE * Math.max(1, Math.hypot(dx, dy));

  return (
    Math.abs(cross) <= tolerance &&
    x >= Math.min(xi, xj) - BOUNDARY_TOLERANCE &&
    x <= Math.max(xi, xj) + BOUNDARY_TOLERANCE &&
    y >= Math.min(yi, yj) - BOUNDARY_TOLERANCE &&
    y <= Math.max(yi, yj) + BOUNDARY_TOLERANCE
  );
};

const isWithinPolygon = (
  point: unknown,
  polygon: Array<[number, number]>,
): boolean => {
  if (!isCoordinatePair(point)) {
    return false;
  }

  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    if (isOnSegment(x, y, xi, yi, xj, yj)) {
      return true;
    }

    // Divide before multiplying so extreme coordinates do not overflow.
    if (yi > y !== yj > y && x < (xj - xi) * ((y - yi) / (yj - yi)) + xi) {
      inside = !inside;
    }
  }

  return inside;
};

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
        !(typeof prop_val === 'number' && prop_val === val),
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
          !(
            typeof min === 'number' &&
            typeof max === 'number' &&
            typeof prop_val === 'number' &&
            prop_val >= min &&
            prop_val <= max
          ),
    },
    none_of: {
      params: ['array:number'],
      func: (field, vals) => (entity, prop_val) =>
        !(
          Array.isArray(vals) &&
          typeof prop_val === 'number' &&
          vals.some((v) => v === prop_val)
        ),
    },
    any_of: {
      params: ['array:number'],
      func: (field, vals) => (entity, prop_val) =>
        Array.isArray(vals) &&
        typeof prop_val === 'number' &&
        vals.some((v) => v === prop_val),
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
        typeof prop_val === 'string' &&
        typeof val === 'string' &&
        prop_val.toLowerCase() === val?.toLowerCase(),
    },
    neq: {
      params: ['string'],
      func: (field, val) => (entity, prop_val) =>
        !(
          typeof prop_val === 'string' &&
          typeof val === 'string' &&
          prop_val.toLowerCase() === val?.toLowerCase()
        ),
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
        !(
          typeof prop_val === 'string' &&
          typeof val === 'string' &&
          escapeAndCompileRegex(val).test(prop_val)
        ),
    },
    none_of: {
      params: ['array:string'],
      func: (field, vals) => (entity, prop_val) =>
        !(
          Array.isArray(vals) &&
          typeof prop_val === 'string' &&
          vals.some(
            (v) =>
              typeof v === 'string' &&
              v.toLowerCase() === prop_val.toLowerCase(),
          )
        ),
    },
    any_of: {
      params: ['array:string'],
      func: (field, vals) => (entity, prop_val) =>
        Array.isArray(vals) &&
        typeof prop_val === 'string' &&
        vals.some(
          (v) =>
            typeof v === 'string' && v.toLowerCase() === prop_val.toLowerCase(),
        ),
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
        !(typeof prop_val === 'string' && prop_val === val),
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
        !(
          typeof prop_val === 'string' &&
          typeof val === 'string' &&
          escapeAndCompileRegex(val).test(prop_val)
        ),
    },
    none_of: {
      params: ['array:string'],
      func: (field, vals) => (entity, prop_val) =>
        !(
          Array.isArray(vals) &&
          typeof prop_val === 'string' &&
          vals.includes(prop_val)
        ),
    },
    any_of: {
      params: ['array:string'],
      func: (field, vals) => (entity, prop_val) =>
        Array.isArray(vals) &&
        typeof prop_val === 'string' &&
        vals.includes(prop_val),
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
          !(
            DateTime.isDateTime(from) &&
            DateTime.isDateTime(to) &&
            DateTime.isDateTime(prop_val) &&
            prop_val >= from &&
            prop_val <= to
          ),
    },
    in_last: {
      params: ['string'],
      func: (field, val) => (entity, prop_val) => {
        const duration =
          typeof val === 'string' ? Duration.fromISO(val) : undefined;
        return (
          !!duration &&
          duration.isValid &&
          DateTime.isDateTime(prop_val) &&
          prop_val >= DateTime.utc().minus(duration)
        );
      },
    },
    not_in_last: {
      params: ['string'],
      func: (field, val) => (entity, prop_val) => {
        const duration =
          typeof val === 'string' ? Duration.fromISO(val) : undefined;
        return !(
          !!duration &&
          duration.isValid &&
          DateTime.isDateTime(prop_val) &&
          prop_val >= DateTime.utc().minus(duration)
        );
      },
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
    none_of: {
      params: ['array:number'],
      func: (field, vals) => (entity, prop_vals) =>
        !(
          Array.isArray(prop_vals) &&
          Array.isArray(vals) &&
          vals.some((v) => prop_vals.includes(v))
        ),
    },
    any_of: {
      params: ['array:number'],
      func: (field, vals) => (entity, prop_vals) =>
        Array.isArray(prop_vals) &&
        Array.isArray(vals) &&
        vals.some((v) => prop_vals.includes(v)),
    },
    all_of: {
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
    none_of: {
      params: ['array:string'],
      func: (field, vals) => (entity, prop_vals) =>
        !(
          Array.isArray(prop_vals) &&
          Array.isArray(vals) &&
          vals
            .map((v) => (v as string).toLowerCase())
            .some((v) =>
              prop_vals.map((pv) => (pv as string).toLowerCase()).includes(v),
            )
        ),
    },
    any_of: {
      params: ['array:string'],
      func: (field, vals) => (entity, prop_vals) =>
        Array.isArray(prop_vals) &&
        Array.isArray(vals) &&
        vals
          .map((v) => (v as string).toLowerCase())
          .some((v) =>
            prop_vals.map((pv) => (pv as string).toLowerCase()).includes(v),
          ),
    },
    all_of: {
      params: ['array:string'],
      func: (field, vals) => (entity, prop_vals) =>
        Array.isArray(prop_vals) &&
        Array.isArray(vals) &&
        vals
          .map((v) => (v as string).toLowerCase())
          .every((v) =>
            prop_vals.map((pv) => (pv as string).toLowerCase()).includes(v),
          ),
    },
  },
  location: {
    known: {
      params: ['number', 'number'],
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
    within_polygon: {
      params: ['location'],
      func: (field, polygon) => (entity, prop_val) =>
        isWithinPolygon(prop_val, polygon),
    },
    not_within_polygon: {
      params: ['location'],
      func: (field, polygon) => (entity, prop_val) =>
        !isWithinPolygon(prop_val, polygon),
    },
  },
};

export default operators;
