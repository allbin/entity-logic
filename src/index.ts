import { DateTime } from 'luxon';

import { Entity, EntitySchema, EntitySchemaPropsByKey } from './types/schema';

import {
  Filter,
  FilterCondition,
  SerializedFilter,
  SerializedFilterCondition,
} from './types/filter';

import operators, { Operator } from './operators';

const executeCondition = <T>(
  schemaPropsByKey: EntitySchemaPropsByKey,
  entities: Entity<T>[],
  condition: FilterCondition,
): Entity<T>[] => {
  const op = validateFilterCondition(schemaPropsByKey, condition);

  return entities.filter((e) =>
    op.func(condition.field, condition.value)(e, e.properties[condition.field]),
  );
};

const executeFilter = <T>(
  schemaPropsByKey: EntitySchemaPropsByKey,
  entities: Entity<T>[],
  conditions: Filter,
): Entity<T>[] => {
  return conditions.reduce<Entity<T>[]>(
    (entities, condition) =>
      executeCondition<T>(schemaPropsByKey, entities, condition),
    entities,
  );
};

interface SeparatedResults<T> {
  matched: Entity<T>[];
  unmatched: Entity<T>[];
}

const executeFilterWithSeparatedResults = <T>(
  schemaPropsByKey: EntitySchemaPropsByKey,
  entities: Entity<T>[],
  conditions: Filter,
): SeparatedResults<T> => {
  conditions.forEach((condition) =>
    validateFilterCondition(schemaPropsByKey, condition),
  );

  return entities.reduce<SeparatedResults<T>>(
    (results, entity) => {
      if (
        conditions.some((condition) => {
          const op = operators[condition.type]?.[condition.operator];
          return !op.func(condition.field, condition.value)(
            entity,
            entity.properties[condition.field],
          );
        })
      ) {
        results.unmatched.push(entity);
      } else {
        results.matched.push(entity);
      }
      return results;
    },
    {
      matched: [],
      unmatched: [],
    },
  );
};

const validateSchema = (schema: EntitySchema): void => {
  if (!schema.groups) {
    throw new Error(`Schema is missing the 'groups' property`);
  }
  if (!schema.properties) {
    throw new Error(`Schema is missing the 'properties' property`);
  }

  schema.groups.forEach((group) => {
    if (typeof group.id !== 'number') {
      throw new Error(`Schema group has no/invalid 'id' property`);
    }
    if (typeof group.name !== 'string') {
      throw new Error(`Schema group has no/invalid 'name' property`);
    }
  });

  schema.properties.forEach((prop) => {
    if (!prop.key || !/^meta\.|^inventory\.|^derived\./.test(prop.key)) {
      throw new Error(`Schema prop has invalid key: ${prop.key}`);
    }
    if (!prop.type) {
      throw new Error(
        `Schema prop ${prop.key} has no/invalid type: ${prop.type as string}`,
      );
    }
    if (!prop.name) {
      throw new Error(
        `Schema prop ${prop.key} has no/invalid name: ${prop.name}`,
      );
    }

    if (
      ![
        'boolean',
        'number',
        'string',
        'enum',
        'date',
        'photo',
        'array:number',
        'array:string',
        'location',
      ].includes(prop.type)
    ) {
      throw new Error(
        `Schema prop ${prop.key} has unknown type: '${prop.type}'`,
      );
    }

    if (prop.type === 'enum') {
      if (
        !prop.alternatives ||
        !Array.isArray(prop.alternatives) ||
        prop.alternatives.length === 0
      ) {
        throw new Error(
          `Schema prop ${prop.key} of type 'enum' has no/invalid 'alternatives' property`,
        );
      }
    }

    if (typeof prop.group_id !== 'undefined') {
      if (typeof prop.group_id !== 'number') {
        throw new Error(
          `Schema prop '${prop.key} has invalid 'group_id' property`,
        );
      }

      if (!schema.groups.find((group) => group.id === prop.group_id)) {
        throw new Error(
          `Schema prop '${prop.key}' is referencing a non-existent group_id: ${prop.group_id}`,
        );
      }
    }

    if (typeof prop.alternatives !== 'undefined') {
      if (prop.type !== 'enum') {
        throw new Error(
          `Schema prop '${prop.key}' has 'alternatives' propety, but is not of type 'enum'`,
        );
      }
    }
  });
};

/**
 * Returns an `Operator` for the `FilterCondition`.
 * If the `FilterCondition` is invalid, an Error is thrown.
 */
const validateFilterCondition = (
  schemaPropsByKey: EntitySchemaPropsByKey,
  condition: FilterCondition,
): Operator => {
  const prop = schemaPropsByKey[condition.field];
  if (!prop) {
    throw new Error(
      `Filter condition references non-existent schema property: ${condition.field}`,
    );
  }

  if (prop.type !== condition.type) {
    throw new Error(
      `Filter condition has invalid prop type for schema property: ${condition.field}`,
    );
  }

  const op = operators[condition.type]?.[condition.operator];
  if (!op) {
    throw new Error(
      `Invalid operator (${condition.operator}) for type: ${prop.type}`,
    );
  }

  if (
    condition.operator === 'known' ||
    condition.operator === 'unknown' ||
    condition.operator === 'true' ||
    condition.operator === 'false'
  ) {
    if (typeof condition.value !== 'undefined') {
      throw new Error(
        `Invalid condition value for ${condition.type}:${condition.operator}`,
      );
    }
  }

  if (condition.type === 'number') {
    switch (condition.operator) {
      case 'eq':
      case 'neq':
      case 'gt':
      case 'gte':
      case 'lt':
      case 'lte':
        if (
          typeof condition.value !== 'number' ||
          Number.isNaN(condition.value)
        ) {
          throw new Error(
            `Invalid condition value for ${condition.type}:${condition.operator}`,
          );
        }
        break;
      case 'between':
      case 'not_between':
      case 'none_of':
      case 'any_of':
        if (
          !Array.isArray(condition.value) ||
          condition.value.some((v) => typeof v !== 'number' || Number.isNaN(v))
        ) {
          throw new Error(
            `Invalid condition value for ${condition.type}:${condition.operator}`,
          );
        }
        break;
    }
  } else if (condition.type === 'string') {
    switch (condition.operator) {
      case 'eq':
      case 'neq':
      case 'matches':
      case 'not_matches':
        if (typeof condition.value !== 'string') {
          throw new Error(
            `Invalid condition value for ${condition.type}:${condition.operator}`,
          );
        }
        break;
      case 'none_of':
      case 'any_of':
        if (
          !Array.isArray(condition.value) ||
          condition.value.some((v) => typeof v !== 'string')
        ) {
          throw new Error(
            `Invalid condition value for ${condition.type}:${condition.operator}`,
          );
        }
        break;
    }
  } else if (condition.type === 'enum') {
    switch (condition.operator) {
      case 'eq':
      case 'neq':
      case 'matches':
      case 'not_matches':
        if (typeof condition.value !== 'string') {
          throw new Error(
            `Invalid condition value for ${condition.type}:${condition.operator}`,
          );
        }
        break;
      case 'none_of':
      case 'any_of':
        if (
          !Array.isArray(condition.value) ||
          condition.value.some(
            (v) =>
              typeof v !== 'string' ||
              !prop.alternatives ||
              !prop.alternatives.includes(v),
          )
        ) {
          throw new Error(
            `Invalid condition value for ${condition.type}:${condition.operator}`,
          );
        }
        break;
    }
  } else if (condition.type === 'date') {
    switch (condition.operator) {
      case 'before':
      case 'after':
        if (!DateTime.isDateTime(condition.value)) {
          throw new Error(
            `Invalid condition value for ${condition.type}:${condition.operator}`,
          );
        }
        break;
      case 'between':
      case 'not_between':
        if (
          !Array.isArray(condition.value) ||
          condition.value.some((v) => !DateTime.isDateTime(v))
        ) {
          throw new Error(
            `Invalid condition value for ${condition.type}:${condition.operator}`,
          );
        }
        break;
    }
  } else if (condition.type === 'array:number') {
    switch (condition.operator) {
      case 'none_of':
      case 'any_of':
      case 'all_of':
        if (
          !Array.isArray(condition.value) ||
          condition.value.some((v) => typeof v !== 'number' || Number.isNaN(v))
        ) {
          throw new Error(
            `Invalid condition value for ${condition.type}:${condition.operator}`,
          );
        }
        break;
    }
  } else if (condition.type === 'array:string') {
    switch (condition.operator) {
      case 'none_of':
      case 'any_of':
      case 'all_of':
        if (
          !Array.isArray(condition.value) ||
          condition.value.some((v) => typeof v !== 'string')
        ) {
          throw new Error(
            `Invalid condition value for ${condition.type}:${condition.operator}`,
          );
        }
        break;
    }
  }

  return op;
};

/**
 * Returns a list consisting of one `Operator` for each filter condition in the filter.
 * Throws an Error if any `FilterCondition` is invalid.
 */
const validateFilter = (
  schemaPropsByKey: EntitySchemaPropsByKey,
  filter: Filter,
): Operator[] => {
  return filter.map((f) => validateFilterCondition(schemaPropsByKey, f));
};

const validateProperties = (
  schemaPropsByKey: EntitySchemaPropsByKey,
  properties: Record<string, unknown>,
): void => {
  Object.keys(properties).forEach((p) => {
    const prop_value = properties[p];
    const schema_prop = schemaPropsByKey[p];

    if (!schema_prop) {
      throw new Error(`Unknown property '${p}'`);
    }
    switch (schema_prop.type) {
      case 'boolean': {
        if (typeof prop_value !== 'boolean') {
          throw new Error(
            `Value of property '${p}' is invalid. Should be a boolean`,
          );
        }
        break;
      }
      case 'number': {
        if (typeof prop_value !== 'number' || Number.isNaN(prop_value)) {
          throw new Error(
            `Value of property '${p}' is invalid. Should be a number`,
          );
        }
        break;
      }
      case 'string': {
        if (typeof prop_value !== 'string') {
          throw new Error(
            `Value of property '${p}' is invalid. Should be a string`,
          );
        }
        break;
      }
      case 'enum': {
        if (typeof prop_value !== 'string') {
          throw new Error(
            `Value of property '${p}' is invalid. Should be a string`,
          );
        }
        break;
      }
      case 'date': {
        if (
          (typeof prop_value !== 'string' ||
            !/^[0-9]{4}-[0-9]{2}-[0-9]{2}[ T][0-9]{2}:[0-9]{2}:[0-9]{2}/.test(
              prop_value,
            )) &&
          !(prop_value instanceof Date && !Number.isNaN(prop_value))
        ) {
          throw new Error(
            `Value of property '${p}' is invalid. Should be a date or iso-string`,
          );
        }
        break;
      }
      case 'photo': {
        if (typeof prop_value !== 'string') {
          throw new Error(
            `Value of property '${p}' is invalid. Should be a string`,
          );
        }
        break;
      }
      case 'array:number': {
        if (
          !Array.isArray(prop_value) ||
          prop_value.some((v) => typeof v !== 'number' || Number.isNaN(v))
        ) {
          throw new Error(
            `Value of property '${p}' is invalid. Should be an array of numbers`,
          );
        }
        break;
      }
      case 'array:string': {
        if (
          !Array.isArray(prop_value) ||
          prop_value.some((v) => typeof v !== 'string')
        ) {
          throw new Error(
            `Value of property '${p}' is invalid. Should be an array of strings`,
          );
        }
        break;
      }
      case 'location': {
        if (
          !Array.isArray(prop_value) ||
          prop_value.length < 2 ||
          prop_value.some((v) => typeof v !== 'number' || Number.isNaN(v))
        ) {
          throw new Error(
            `Value of property '${p}' is invalid. Should be a location`,
          );
        }
        break;
      }
    }
  });
};

const validatePropertiesModifiable = (
  schemaPropsByKey: EntitySchemaPropsByKey,
  prev_properties: Record<string, unknown>,
  properties: Record<string, unknown>,
  options?: ValidatePropertiesModifiableOptions,
): void => {
  Object.keys(schemaPropsByKey)
    .filter((p) => !schemaPropsByKey[p].modifiable)
    .forEach((p) => {
      const schema_prop = schemaPropsByKey[p];
      if (!schema_prop) {
        throw new Error(`Unknown property '${p}'`);
      }

      /* reenable later when this makes sense */
      /*
      if (
        options?.strict &&
        Object.prototype.hasOwnProperty.call(properties, p)
      ) {
        throw new Error(
          `Property '${p}' is not modifiable and must not be included in updates`,
        );
      }
      */

      let invalid = false;
      const prev_val = prev_properties[p];
      const prop_val = properties[p];

      switch (schema_prop.type) {
        case 'location':
        case 'array:number':
        case 'array:string': {
          const prev_is_array = Array.isArray(prev_val);
          const prop_is_array = Array.isArray(prop_val);
          if (prev_is_array !== prop_is_array) {
            invalid = true;
          }
          if (!!prev_val !== !!prop_val) {
            invalid = true;
          }
          if (Array.isArray(prev_val) && Array.isArray(prop_val)) {
            if (prev_val.length !== prop_val.length) {
              invalid = true;
            }
            for (let i = 0; i < prev_val.length; i++) {
              if (prev_val[i] !== prop_val[i]) {
                invalid = true;
              }
            }
          }
          break;
        }
        case 'boolean':
        case 'number':
        case 'string':
        case 'date':
        case 'photo': {
          if (prev_val !== prop_val) {
            invalid = true;
          }
          break;
        }
      }

      if (invalid) {
        throw new Error(
          `Properties include modification to readonly property ${p}`,
        );
      }
    });
};

const serializeFilterCondition = (
  condition: FilterCondition,
): SerializedFilterCondition => {
  if (condition.type === 'date') {
    if (condition.operator === 'before' || condition.operator === 'after') {
      return { ...condition, value: condition.value.toISO() };
    } else if (
      condition.operator === 'between' ||
      condition.operator === 'not_between'
    ) {
      return { ...condition, value: condition.value.map((c) => c.toISO()) };
    }
  }
  return condition as SerializedFilterCondition;
};

const unserializeFilterCondition = (
  condition: SerializedFilterCondition,
): FilterCondition => {
  if (condition.type === 'date') {
    if (condition.operator === 'before' || condition.operator === 'after') {
      return { ...condition, value: DateTime.fromISO(condition.value) };
    } else if (
      condition.operator === 'between' ||
      condition.operator === 'not_between'
    ) {
      return {
        ...condition,
        value: condition.value.map((c) => DateTime.fromISO(c)),
      };
    }
  }
  return condition as FilterCondition;
};

const isFilterConditionEqual = (
  a_unserialized: FilterCondition,
  b_unserialized: FilterCondition,
): boolean => {
  const a = serializeFilterCondition(a_unserialized);
  const b = serializeFilterCondition(b_unserialized);

  if (a.type !== b.type) {
    return false;
  }

  if (a.field !== b.field) {
    return false;
  }

  if (a.operator !== b.operator) {
    return false;
  }

  if (['array:number', 'array:string', 'location'].includes(a.type)) {
    const a_arr = a.value as Array<unknown>;
    const b_arr = a.value as Array<unknown>;

    if (a_arr.length !== b_arr.length) {
      return false;
    }

    for (let i = 0; i < a_arr.length; i++) {
      if (a_arr[i] !== b_arr[i]) {
        return false;
      }
    }
  } else {
    if (a.value !== b.value) {
      return false;
    }
  }

  return true;
};

const isFilterEqual = (a: Filter, b: Filter): boolean => {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (!isFilterConditionEqual(a[i], b[i])) {
      return false;
    }
  }

  return true;
};

interface ValidatePropertiesModifiableOptions {
  strict?: boolean;
}

interface EntityLogic {
  matches: <T>(entity: Entity<T>, filter: Filter) => boolean;
  execute: <T>(entities: Entity<T>[], filter: Filter) => Entity<T>[];
  executeWithSeparatedResults: <T>(
    entities: Entity<T>[],
    filter: Filter,
  ) => SeparatedResults<T>;
  validateCondition: (condtion: FilterCondition) => Operator;
  validateFilter: (filter: Filter) => Operator[];
  validateProperties: (properties: Record<string, unknown>) => void;
  validatePropertiesModifiable: (
    prev_properties: Record<string, unknown>,
    properties: Record<string, unknown>,
    options?: ValidatePropertiesModifiableOptions,
  ) => void;

  serializeFilterCondition: (
    condition: FilterCondition,
  ) => SerializedFilterCondition;
  unserializeFilterCondition: (
    condition: SerializedFilterCondition,
  ) => FilterCondition;

  serializeFilter: (filter: Filter) => SerializedFilter;
  unserializeFilter: (filter: SerializedFilter) => Filter;

  isFilterConditionEqual: (a: FilterCondition, b: FilterCondition) => boolean;
  isFilterEqual: (a: Filter, b: Filter) => boolean;
}

const EntityLogic = (schema: EntitySchema): EntityLogic => {
  validateSchema(schema);
  const propsByKey = schema.properties.reduce<EntitySchemaPropsByKey>(
    (propsByKey, prop) => {
      propsByKey[prop.key] = prop;
      return propsByKey;
    },
    {},
  );

  return {
    matches: (entity, filter: Filter) =>
      filter.every((condition) =>
        validateFilterCondition(propsByKey, condition).func(
          condition.field,
          condition.value,
        )(entity, entity.properties[condition.field]),
      ),
    execute: (entities, filter) => executeFilter(propsByKey, entities, filter),
    executeWithSeparatedResults: (entities, filter) =>
      executeFilterWithSeparatedResults(propsByKey, entities, filter),
    validateCondition: (condition: FilterCondition): Operator =>
      validateFilterCondition(propsByKey, condition),
    validateFilter: (filter: Filter): Operator[] =>
      validateFilter(propsByKey, filter),
    validateProperties: (properties: Record<string, unknown>) =>
      validateProperties(propsByKey, properties),
    validatePropertiesModifiable: (
      prev_properties: Record<string, unknown>,
      properties: Record<string, unknown>,
      options?: ValidatePropertiesModifiableOptions,
    ) =>
      validatePropertiesModifiable(
        propsByKey,
        prev_properties,
        properties,
        options,
      ),

    serializeFilterCondition: (condition) =>
      serializeFilterCondition(condition),
    unserializeFilterCondition: (condition) =>
      unserializeFilterCondition(condition),
    serializeFilter: (filter) =>
      filter.map((fc) => serializeFilterCondition(fc)),
    unserializeFilter: (filter) =>
      filter.map((fc) => unserializeFilterCondition(fc)),
    isFilterConditionEqual: (a, b) => isFilterConditionEqual(a, b),
    isFilterEqual: (a, b) => isFilterEqual(a, b),
  };
};

export * from './types/filter';
export * from './types/schema';

export { EntityLogic, validateSchema };
