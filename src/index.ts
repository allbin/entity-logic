import {
  Entity,
  EntitySchema,
  EntitySchemaPropsByKey,
  EntitySchemaPropType,
} from './types/schema';
import {
  Filter,
  FilterCondition,
  FilterOperator,
  FilterValue,
} from './types/filter';

import operators from './operators';

interface EntityLogic {
  execute: (entities: Entity[], filter: Filter) => Entity[];
}

const executeCondition = (
  schemaPropsByKey: EntitySchemaPropsByKey,
  entities: Entity[],
  condition: FilterCondition,
): Entity[] => {
  const prop = schemaPropsByKey[condition.field];
  if (!prop) {
    throw new Error(
      `Filter condition references non-existent schema property: ${condition.field}`,
    );
  }

  if (condition.propType !== prop.type) {
    throw new Error(
      `Filter condition has invalid prop type for schema property: ${condition.field}`,
    );
  }

  const op = operators[condition.propType]?.[condition.operator];
  if (!op) {
    throw new Error(
      `Invalid operator (${condition.operator}) for type: ${prop.type}`,
    );
  }

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

const EntityLogic = (schema: EntitySchema): EntityLogic => {
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
  };
};

export {
  Entity,
  EntitySchema,
  EntityLogic,
  EntitySchemaPropType,
  Filter,
  FilterCondition,
  FilterOperator,
  FilterValue,
};
