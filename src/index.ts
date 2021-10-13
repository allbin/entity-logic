import { Entity, EntitySchema, EntitySchemaPropsByKey } from './types/schema';

import { Filter, FilterCondition } from './types/filter';

import operators, { Operator } from './operators';

interface EntityLogic {
  execute: (entities: Entity[], filter: Filter) => Entity[];
  validateCondition: (condtion: FilterCondition) => Operator;
  validateFilter: (filter: Filter) => Operator[];
  validateProperties: (properties: Record<string, unknown>) => void;
}

const executeCondition = (
  schemaPropsByKey: EntitySchemaPropsByKey,
  entities: Entity[],
  condition: FilterCondition,
): Entity[] => {
  const op = validateFilterCondition(schemaPropsByKey, condition);

  return entities.filter((e) =>
    op.func(condition.field, condition.value)(e, e.properties[condition.field]),
  );
};

const executeFilter = (
  schemaPropsByKey: EntitySchemaPropsByKey,
  entities: Entity[],
  conditions: Filter,
): Entity[] => {
  return conditions.reduce<Entity[]>(
    (entities, condition) =>
      executeCondition(schemaPropsByKey, entities, condition),
    entities,
  );
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

  // FIXME: validate filter values

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

const EntityLogic = (schema: EntitySchema): EntityLogic => {
  if (!schema.properties) {
    throw new Error('Invalid schema passed to EntityLogic');
  }
  const propsByKey = schema.properties.reduce<EntitySchemaPropsByKey>(
    (propsByKey, prop) => {
      propsByKey[prop.key] = prop;
      return propsByKey;
    },
    {},
  );

  return {
    execute: (entities: Entity[], filter: Filter): Entity[] =>
      executeFilter(propsByKey, entities, filter),
    validateCondition: (condition: FilterCondition): Operator =>
      validateFilterCondition(propsByKey, condition),
    validateFilter: (filter: Filter): Operator[] =>
      validateFilter(propsByKey, filter),
    validateProperties: (properties: Record<string, unknown>) =>
      validateProperties(propsByKey, properties),
  };
};

export * from './types/filter';
export * from './types/schema';

export { EntityLogic };
