# @allbin/entity-logic

Entity filter executor


### How to use
```typescript
import {
  EntityLogic,
  Entity,
  EntitySchema,
  Filter,
  FilterCondition
} from '@allbin/entity-logic'

const schema: EntitySchema = {
  /* ... */
};

const entities: Entity = [ /* ... */ ];

const hasValue: FilterCondition = {
  field: 'user.1',
  propType: 'string',
  operator: 'known',
}

const matchesWildcardString: FilterCondition = {
  field: 'user.1',
  propType: 'string',
  operator: 'matches',
  value: 'wild*cards'
};

const filter: Filter = [
  hasValue,
  matchesWildcardString,
];

const logic = EntityLogic(schema);  // need one of these per schema

const result = logic.execute(entities, filter);

```
