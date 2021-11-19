import { DateTime } from 'luxon';

import { Entity, EntitySchema, EntitySchemaPropsByKey } from './types/schema';

import { Filter, FilterCondition } from './types/filter';

import operators, { Operator } from './operators';

interface EntityLogic {
  execute: <T>(entities: Entity<T>[], filter: Filter) => Entity<T>[];
  validateCondition: (condtion: FilterCondition) => Operator;
  validateFilter: (filter: Filter) => Operator[];
  validateProperties: (properties: Record<string, unknown>) => void;
  validatePropertiesModifiable: (
    prev_properties: Record<string, unknown>,
    properties: Record<string, unknown>,
  ) => void;
}

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
    if (
      !prop.key ||
      !/^meta\.|^inventory\.|^derived\.|^photo\./.test(prop.key)
    ) {
      throw new Error(`Schema prop has no/invalid key`);
    }
    if (!prop.type) {
      throw new Error(`Schema prop has no/invalid type`);
    }
    if (!prop.name) {
      throw new Error(`Schema prop has no/invalid name`);
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
        if (typeof condition.value !== 'number') {
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
          condition.value.some((v) => typeof v !== 'number')
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
          condition.value.some((v) => typeof v !== 'number')
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
        if (typeof prop_value !== 'number') {
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
          prop_value.some((v) => typeof v !== 'number')
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
    }
  });
};

const validatePropertiesModifiable = (
  schemaPropsByKey: EntitySchemaPropsByKey,
  prev_properties: Record<string, unknown>,
  properties: Record<string, unknown>,
): void => {
  Object.keys(properties).forEach((p) => {
    const schema_prop = schemaPropsByKey[p];

    if (!schema_prop) {
      throw new Error(`Unknown property '${p}'`);
    }

    const prev_val = prev_properties[p];
    const prop_val = properties[p];

    if (!schema_prop.modifiable && prev_val !== prop_val) {
      throw new Error(
        `Properties include modification to readonly property ${p}`,
      );
    }
  });
};

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
    execute: (entities, filter) => executeFilter(propsByKey, entities, filter),
    validateCondition: (condition: FilterCondition): Operator =>
      validateFilterCondition(propsByKey, condition),
    validateFilter: (filter: Filter): Operator[] =>
      validateFilter(propsByKey, filter),
    validateProperties: (properties: Record<string, unknown>) =>
      validateProperties(propsByKey, properties),
    validatePropertiesModifiable: (
      prev_properties: Record<string, unknown>,
      properties: Record<string, unknown>,
    ) => validatePropertiesModifiable(propsByKey, prev_properties, properties),
  };
};

export * from './types/filter';
export * from './types/schema';

export { EntityLogic, validateSchema };
