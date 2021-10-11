import { Entity, EntitySchema, EntitySchemaPropsByKey } from './types/schema';

import { Filter, FilterCondition } from './types/filter';

import operators, { Operator } from './operators';

interface EntityLogic {
  execute: (entities: Entity[], filter: Filter) => Entity[];
  validate: (filter: Filter) => Operator[];
  validateCondition: (condtion: FilterCondition) => Operator;
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

  return op;
};

const validateFilter = (
  schemaPropsByKey: EntitySchemaPropsByKey,
  filter: Filter,
): Operator[] => {
  return filter.map((f) => validateFilterCondition(schemaPropsByKey, f));
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
    validate: (filter: Filter): Operator[] =>
      validateFilter(propsByKey, filter),
    validateCondition: (condition: FilterCondition): Operator =>
      validateFilterCondition(propsByKey, condition),
  };
};

export * from './types/filter';
export * from './types/schema';

export { EntityLogic };
