import {
  EntityLogic,
  EntitySchema,
  FilterCondition,
  validateSchema,
} from './index';

import { DateTime } from 'luxon';
import {
  arrayEvenNumbersEntity,
  arrayOddNumbersEntity,
  arrayStringEntityFirst,
  arrayStringEntitySecond,
  booleanFalseEntity,
  booleanTrueEntity,
  date5MinAgoEntity,
  dateEpochEntity,
  entities,
  entityLogic,
  enumEntity,
  locationEntity,
  numberOneEntity,
  numberZeroEntity,
  photoEntity,
  schema,
  stringWithLengthEntity,
  stringWithNoLengthEntity,
  undefinedEntity,
} from './testdata';

describe('executeSeparated', () => {
  it('correctly executes a filter and separates the results', () => {
    const condition: FilterCondition = {
      field: 'inventory.1',
      type: 'boolean',
      operator: 'known',
    };

    const results = entityLogic.executeWithSeparatedResults(entities, [
      condition,
    ]);
    expect(results.matched).toMatchObject([
      booleanFalseEntity,
      booleanTrueEntity,
    ]);
    expect(results.unmatched).toMatchObject([
      undefinedEntity,
      numberOneEntity,
      numberZeroEntity,
      stringWithLengthEntity,
      stringWithNoLengthEntity,
      dateEpochEntity,
      date5MinAgoEntity,
      enumEntity,
      photoEntity,
      arrayEvenNumbersEntity,
      arrayOddNumbersEntity,
      arrayStringEntityFirst,
      arrayStringEntitySecond,
      locationEntity,
    ]);
  });
});

describe('boolean operators', () => {
  it('correctly executes boolean.known conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.1',
      type: 'boolean',
      operator: 'known',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([booleanFalseEntity, booleanTrueEntity]);
  });

  it('correctly executes boolean.unknown conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.1',
      type: 'boolean',
      operator: 'unknown',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([
      undefinedEntity,
      numberOneEntity,
      numberZeroEntity,
      stringWithLengthEntity,
      stringWithNoLengthEntity,
      dateEpochEntity,
      date5MinAgoEntity,
      enumEntity,
      photoEntity,
      arrayEvenNumbersEntity,
      arrayOddNumbersEntity,
      arrayStringEntityFirst,
      arrayStringEntitySecond,
      locationEntity,
    ]);
  });

  it('correctly executes boolean.true conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.1',
      type: 'boolean',
      operator: 'true',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([booleanTrueEntity]);
  });

  it('correctly executes boolean.false conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.1',
      type: 'boolean',
      operator: 'false',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([booleanFalseEntity]);
  });
});

describe('number operators', () => {
  it('correctly executes number.known conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.2',
      type: 'number',
      operator: 'known',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([numberOneEntity, numberZeroEntity]);
  });

  it('correctly executes number.unknown conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.2',
      type: 'number',
      operator: 'unknown',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([
      undefinedEntity,
      booleanFalseEntity,
      booleanTrueEntity,
      stringWithLengthEntity,
      stringWithNoLengthEntity,
      dateEpochEntity,
      date5MinAgoEntity,
      enumEntity,
      photoEntity,
      arrayEvenNumbersEntity,
      arrayOddNumbersEntity,
      arrayStringEntityFirst,
      arrayStringEntitySecond,
      locationEntity,
    ]);
  });

  it('correctly executes number.eq conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.2',
      type: 'number',
      operator: 'eq',
      value: 0,
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([numberZeroEntity]);
  });

  it('correctly executes number.neq conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.2',
      type: 'number',
      operator: 'neq',
      value: 0,
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([
      undefinedEntity,
      booleanFalseEntity,
      booleanTrueEntity,
      numberOneEntity,
      stringWithLengthEntity,
      stringWithNoLengthEntity,
      dateEpochEntity,
      date5MinAgoEntity,
      enumEntity,
      photoEntity,
      arrayEvenNumbersEntity,
      arrayOddNumbersEntity,
      arrayStringEntityFirst,
      arrayStringEntitySecond,
      locationEntity,
    ]);
  });

  it('correctly executes number.gt conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.2',
      type: 'number',
      operator: 'gt',
      value: 0,
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([numberOneEntity]);
  });

  it('correctly executes number.gte conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.2',
      type: 'number',
      operator: 'gte',
      value: 0,
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([numberOneEntity, numberZeroEntity]);
  });

  it('correctly executes number.lt conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.2',
      type: 'number',
      operator: 'lt',
      value: 1,
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([numberZeroEntity]);
  });

  it('correctly executes number.lte conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.2',
      type: 'number',
      operator: 'lte',
      value: 1,
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([numberOneEntity, numberZeroEntity]);
  });

  it('correctly executes number.between conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.2',
      type: 'number',
      operator: 'between',
      value: [0, 0],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([numberZeroEntity]);
  });

  it('correctly executes number.not_between conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.2',
      type: 'number',
      operator: 'not_between',
      value: [0, 0],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([
      undefinedEntity,
      booleanFalseEntity,
      booleanTrueEntity,
      numberOneEntity,
      stringWithLengthEntity,
      stringWithNoLengthEntity,
      dateEpochEntity,
      date5MinAgoEntity,
      enumEntity,
      photoEntity,
      arrayEvenNumbersEntity,
      arrayOddNumbersEntity,
      arrayStringEntityFirst,
      arrayStringEntitySecond,
      locationEntity,
    ]);
  });

  it('correctly executes number.none_of conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.2',
      type: 'number',
      operator: 'none_of',
      value: [1, 2],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([
      undefinedEntity,
      booleanFalseEntity,
      booleanTrueEntity,
      numberZeroEntity,
      stringWithLengthEntity,
      stringWithNoLengthEntity,
      dateEpochEntity,
      date5MinAgoEntity,
      enumEntity,
      photoEntity,
      arrayEvenNumbersEntity,
      arrayOddNumbersEntity,
      arrayStringEntityFirst,
      arrayStringEntitySecond,
      locationEntity,
    ]);
  });

  it('correctly executes number.any_of conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.2',
      type: 'number',
      operator: 'any_of',
      value: [1, 2],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([numberOneEntity]);
  });
});

describe('string operators', () => {
  it('correctly executes string.known conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.3',
      type: 'string',
      operator: 'known',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([
      stringWithLengthEntity,
      stringWithNoLengthEntity,
    ]);
  });

  it('correctly executes string.unknown conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.3',
      type: 'string',
      operator: 'unknown',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([
      undefinedEntity,
      booleanFalseEntity,
      booleanTrueEntity,
      numberOneEntity,
      numberZeroEntity,
      dateEpochEntity,
      date5MinAgoEntity,
      enumEntity,
      photoEntity,
      arrayEvenNumbersEntity,
      arrayOddNumbersEntity,
      arrayStringEntityFirst,
      arrayStringEntitySecond,
      locationEntity,
    ]);
  });

  it('correctly executes string.eq conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.3',
      type: 'string',
      operator: 'eq',
      value: 'string',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([stringWithLengthEntity]);
  });

  it('correctly executes string.neq conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.3',
      type: 'string',
      operator: 'neq',
      value: 'string',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([
      undefinedEntity,
      booleanFalseEntity,
      booleanTrueEntity,
      numberOneEntity,
      numberZeroEntity,
      stringWithNoLengthEntity,
      dateEpochEntity,
      date5MinAgoEntity,
      enumEntity,
      photoEntity,
      arrayEvenNumbersEntity,
      arrayOddNumbersEntity,
      arrayStringEntityFirst,
      arrayStringEntitySecond,
      locationEntity,
    ]);
  });

  it('correctly executes string.matches conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.3',
      type: 'string',
      operator: 'matches',
      value: 'r*ng',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([stringWithLengthEntity]);
  });

  it('correctly executes string.not_matches conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.3',
      type: 'string',
      operator: 'not_matches',
      value: 'r*ng',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([
      undefinedEntity,
      booleanFalseEntity,
      booleanTrueEntity,
      numberOneEntity,
      numberZeroEntity,
      stringWithNoLengthEntity,
      dateEpochEntity,
      date5MinAgoEntity,
      enumEntity,
      photoEntity,
      arrayEvenNumbersEntity,
      arrayOddNumbersEntity,
      arrayStringEntityFirst,
      arrayStringEntitySecond,
      locationEntity,
    ]);
  });

  it('correctly executes string.none_of conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.3',
      type: 'string',
      operator: 'none_of',
      value: ['string'],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([
      undefinedEntity,
      booleanFalseEntity,
      booleanTrueEntity,
      numberOneEntity,
      numberZeroEntity,
      stringWithNoLengthEntity,
      dateEpochEntity,
      date5MinAgoEntity,
      enumEntity,
      photoEntity,
      arrayEvenNumbersEntity,
      arrayOddNumbersEntity,
      arrayStringEntityFirst,
      arrayStringEntitySecond,
      locationEntity,
    ]);
  });

  it('correctly executes string.any_of conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.3',
      type: 'string',
      operator: 'any_of',
      value: ['string', ''],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([
      stringWithLengthEntity,
      stringWithNoLengthEntity,
    ]);
  });
});

describe('enum operators', () => {
  it('correctly executes enum.known conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.6',
      type: 'enum',
      operator: 'known',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([enumEntity]);
  });

  it('correctly executes enum.unknown conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.6',
      type: 'enum',
      operator: 'unknown',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([
      undefinedEntity,
      booleanFalseEntity,
      booleanTrueEntity,
      numberOneEntity,
      numberZeroEntity,
      stringWithLengthEntity,
      stringWithNoLengthEntity,
      dateEpochEntity,
      date5MinAgoEntity,
      photoEntity,
      arrayEvenNumbersEntity,
      arrayOddNumbersEntity,
      arrayStringEntityFirst,
      arrayStringEntitySecond,
      locationEntity,
    ]);
  });

  it('correctly executes enum.eq conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.6',
      type: 'enum',
      operator: 'eq',
      value: 'alternative1',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([enumEntity]);
  });

  it('correctly executes enum.neq conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.6',
      type: 'enum',
      operator: 'neq',
      value: 'alternative2',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([
      undefinedEntity,
      booleanFalseEntity,
      booleanTrueEntity,
      numberOneEntity,
      numberZeroEntity,
      stringWithLengthEntity,
      stringWithNoLengthEntity,
      dateEpochEntity,
      date5MinAgoEntity,
      enumEntity,
      photoEntity,
      arrayEvenNumbersEntity,
      arrayOddNumbersEntity,
      arrayStringEntityFirst,
      arrayStringEntitySecond,
      locationEntity,
    ]);
  });

  it('correctly executes enum.matches conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.6',
      type: 'enum',
      operator: 'matches',
      value: 'lter*ive',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([enumEntity]);
  });

  it('correctly executes enum.not_matches conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.6',
      type: 'enum',
      operator: 'not_matches',
      value: 'r*ng',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([
      undefinedEntity,
      booleanFalseEntity,
      booleanTrueEntity,
      numberOneEntity,
      numberZeroEntity,
      stringWithLengthEntity,
      stringWithNoLengthEntity,
      dateEpochEntity,
      date5MinAgoEntity,
      enumEntity,
      photoEntity,
      arrayEvenNumbersEntity,
      arrayOddNumbersEntity,
      arrayStringEntityFirst,
      arrayStringEntitySecond,
      locationEntity,
    ]);
  });

  it('correctly executes enum.none_of conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.6',
      type: 'enum',
      operator: 'none_of',
      value: ['alternative2'],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([
      undefinedEntity,
      booleanFalseEntity,
      booleanTrueEntity,
      numberOneEntity,
      numberZeroEntity,
      stringWithLengthEntity,
      stringWithNoLengthEntity,
      dateEpochEntity,
      date5MinAgoEntity,
      enumEntity,
      photoEntity,
      arrayEvenNumbersEntity,
      arrayOddNumbersEntity,
      arrayStringEntityFirst,
      arrayStringEntitySecond,
      locationEntity,
    ]);
  });

  it('correctly executes enum.any_of conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.6',
      type: 'enum',
      operator: 'any_of',
      value: ['alternative1'],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([enumEntity]);
  });
});

describe('date operators', () => {
  it('correctly executes date.known conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.4',
      type: 'date',
      operator: 'known',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([dateEpochEntity, date5MinAgoEntity]);
  });

  it('correctly executes date.unknown conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.4',
      type: 'date',
      operator: 'unknown',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([
      undefinedEntity,
      booleanFalseEntity,
      booleanTrueEntity,
      numberOneEntity,
      numberZeroEntity,
      stringWithLengthEntity,
      stringWithNoLengthEntity,
      enumEntity,
      photoEntity,
      arrayEvenNumbersEntity,
      arrayOddNumbersEntity,
      arrayStringEntityFirst,
      arrayStringEntitySecond,
      locationEntity,
    ]);
  });

  it('correctly executes date.before conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.4',
      type: 'date',
      operator: 'before',
      value: DateTime.utc().minus({ minutes: 10 }),
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([dateEpochEntity]);
  });

  it('correctly executes date.after conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.4',
      type: 'date',
      operator: 'after',
      value: DateTime.utc().minus({ minutes: 10 }),
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([date5MinAgoEntity]);
  });

  it('correctly executes date.between', () => {
    const condition: FilterCondition = {
      field: 'inventory.4',
      type: 'date',
      operator: 'between',
      value: [DateTime.utc().minus({ minutes: 10 }), DateTime.utc()],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([date5MinAgoEntity]);
  });

  it('correctly executes date.not_between', () => {
    const condition: FilterCondition = {
      field: 'inventory.4',
      type: 'date',
      operator: 'not_between',
      value: [DateTime.utc().minus({ minutes: 10 }), DateTime.utc()],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([
      undefinedEntity,
      booleanFalseEntity,
      booleanTrueEntity,
      numberOneEntity,
      numberZeroEntity,
      stringWithLengthEntity,
      stringWithNoLengthEntity,
      dateEpochEntity,
      enumEntity,
      photoEntity,
      arrayEvenNumbersEntity,
      arrayOddNumbersEntity,
      arrayStringEntityFirst,
      arrayStringEntitySecond,
      locationEntity,
    ]);
  });
});

describe('photo operators', () => {
  it('correctly executes photo.known operators', () => {
    const condition: FilterCondition = {
      field: 'inventory.7',
      type: 'photo',
      operator: 'known',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([photoEntity]);
  });

  it('correctly executes photo.unknown operators', () => {
    const condition: FilterCondition = {
      field: 'inventory.7',
      type: 'photo',
      operator: 'unknown',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([
      undefinedEntity,
      booleanFalseEntity,
      booleanTrueEntity,
      numberOneEntity,
      numberZeroEntity,
      stringWithLengthEntity,
      stringWithNoLengthEntity,
      dateEpochEntity,
      date5MinAgoEntity,
      enumEntity,
      arrayEvenNumbersEntity,
      arrayOddNumbersEntity,
      arrayStringEntityFirst,
      arrayStringEntitySecond,
      locationEntity,
    ]);
  });
});

describe('array:number operators', () => {
  it('correctly executes array:number.known conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.8',
      type: 'array:number',
      operator: 'known',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([
      arrayEvenNumbersEntity,
      arrayOddNumbersEntity,
    ]);
  });

  it('correctly executes array:number.unknown conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.8',
      type: 'array:number',
      operator: 'unknown',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([
      undefinedEntity,
      booleanFalseEntity,
      booleanTrueEntity,
      numberOneEntity,
      numberZeroEntity,
      stringWithLengthEntity,
      stringWithNoLengthEntity,
      dateEpochEntity,
      date5MinAgoEntity,
      enumEntity,
      photoEntity,
      arrayStringEntityFirst,
      arrayStringEntitySecond,
      locationEntity,
    ]);
  });

  it('correctly executes array:number.none_of conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.8',
      type: 'array:number',
      operator: 'none_of',
      value: [3, 7],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([
      undefinedEntity,
      booleanFalseEntity,
      booleanTrueEntity,
      numberOneEntity,
      numberZeroEntity,
      stringWithLengthEntity,
      stringWithNoLengthEntity,
      dateEpochEntity,
      date5MinAgoEntity,
      enumEntity,
      photoEntity,
      arrayEvenNumbersEntity,
      arrayStringEntityFirst,
      arrayStringEntitySecond,
      locationEntity,
    ]);
  });

  it('correctly executes array:number.any_of conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.8',
      type: 'array:number',
      operator: 'any_of',
      value: [2, 10],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([arrayEvenNumbersEntity]);
  });

  it('correctly executes array:number.all_of conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.8',
      type: 'array:number',
      operator: 'all_of',
      value: [3, 5],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([arrayOddNumbersEntity]);
  });
});

describe('array:string operators', () => {
  it('correctly executes array:string.known conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.9',
      type: 'array:string',
      operator: 'known',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([
      arrayStringEntityFirst,
      arrayStringEntitySecond,
    ]);
  });

  it('correctly executes array:string.unknown conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.9',
      type: 'array:string',
      operator: 'unknown',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([
      undefinedEntity,
      booleanFalseEntity,
      booleanTrueEntity,
      numberOneEntity,
      numberZeroEntity,
      stringWithLengthEntity,
      stringWithNoLengthEntity,
      dateEpochEntity,
      date5MinAgoEntity,
      enumEntity,
      photoEntity,
      arrayEvenNumbersEntity,
      arrayOddNumbersEntity,
      locationEntity,
    ]);
  });

  it('correctly executes array:string.none_of conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.9',
      type: 'array:string',
      operator: 'none_of',
      value: ['string1'],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([
      undefinedEntity,
      booleanFalseEntity,
      booleanTrueEntity,
      numberOneEntity,
      numberZeroEntity,
      stringWithLengthEntity,
      stringWithNoLengthEntity,
      dateEpochEntity,
      date5MinAgoEntity,
      enumEntity,
      photoEntity,
      arrayEvenNumbersEntity,
      arrayOddNumbersEntity,
      arrayStringEntitySecond,
      locationEntity,
    ]);
  });

  it('correctly executes array:string.any_of conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.9',
      type: 'array:string',
      operator: 'any_of',
      value: ['string1'],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([arrayStringEntityFirst]);
  });

  it('correctly executes array:string.all_of conditions', () => {
    const condition: FilterCondition = {
      field: 'inventory.9',
      type: 'array:string',
      operator: 'all_of',
      value: ['string5', 'string6'],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([arrayStringEntitySecond]);
  });
});

describe('location operators', () => {
  it('correctly executes location.known conditions', () => {
    const condition: FilterCondition = {
      field: 'meta.location',
      type: 'location',
      operator: 'known',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([locationEntity]);
  });

  it('correctly executes location.unknown conditions', () => {
    const condition: FilterCondition = {
      field: 'meta.location',
      type: 'location',
      operator: 'unknown',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([
      undefinedEntity,
      booleanFalseEntity,
      booleanTrueEntity,
      numberOneEntity,
      numberZeroEntity,
      stringWithLengthEntity,
      stringWithNoLengthEntity,
      dateEpochEntity,
      date5MinAgoEntity,
      enumEntity,
      photoEntity,
      arrayEvenNumbersEntity,
      arrayOddNumbersEntity,
      arrayStringEntityFirst,
      arrayStringEntitySecond,
    ]);
  });
});

describe('validation', () => {
  it('correctly validates a valid filter condition', () => {
    const logic = EntityLogic(schema);

    const condition: FilterCondition = {
      field: 'inventory.6',
      type: 'enum',
      operator: 'any_of',
      value: ['alternative2'],
    };

    const result = logic.validateFilter([condition]);
    expect(result).toBeTruthy();
  });

  it('correctly validates an invalid filter condition', () => {
    const logic = EntityLogic(schema);

    const condition: FilterCondition = {
      field: 'inventory.6',
      type: 'string',
      operator: 'any_of',
      value: ['alternative1'],
    };

    expect(() => logic.validateFilter([condition])).toThrow();
  });

  it('correctly validates a set of valid properties', () => {
    const props = {
      'inventory.6': 'alternative2',
      'inventory.1': true,
      'inventory.2': 0,
      'inventory.3': 'string',
      'inventory.7': 'https://example.com',
      'inventory.8': [0, 1, 2],
      'inventory.9': ['a', 'b', 'c'],
      'inventory.4': new Date(),
      'inventory.5': new Date().toISOString(),
    };

    const logic = EntityLogic(schema);
    expect(() => logic.validateProperties(props)).not.toThrow();
  });

  it('correctly validates an invalid boolean property', () => {
    const props = {
      'inventory.1': 'string',
    };

    const logic = EntityLogic(schema);
    expect(() => logic.validateProperties(props)).toThrow();
  });

  it('correctly validates an invalid number property', () => {
    const props = {
      'inventory.2': 'string',
    };

    const logic = EntityLogic(schema);
    expect(() => logic.validateProperties(props)).toThrow();
  });

  it('correctly validates an invalid string property', () => {
    const props = {
      'inventory.3': 2,
    };

    const logic = EntityLogic(schema);
    expect(() => logic.validateProperties(props)).toThrow();
  });

  it('correctly validates an invalid date property', () => {
    const props = {
      'inventory.4': 'string',
    };

    const logic = EntityLogic(schema);
    expect(() => logic.validateProperties(props)).toThrow();
  });

  it('correctly validates an invalid photo property', () => {
    const props = {
      'inventory.7': 3,
    };

    const logic = EntityLogic(schema);
    expect(() => logic.validateProperties(props)).toThrow();
  });
  it('correctly validates an invalid array:number property', () => {
    const props = {
      'inventory.8': ['a'],
    };

    const logic = EntityLogic(schema);
    expect(() => logic.validateProperties(props)).toThrow();
  });
  it('correctly validates an invalid array:string property', () => {
    const props = {
      'inventory.9': [2],
    };

    const logic = EntityLogic(schema);
    expect(() => logic.validateProperties(props)).toThrow();
  });

  it('correctly validates an invalid location property', () => {
    const props = {
      'meta.location': [1],
    };

    const logic = EntityLogic(schema);
    expect(() => logic.validateProperties(props)).toThrow();
  });

  it('correctly validates a valid schema', () => {
    expect(() => validateSchema(schema)).not.toThrow();
  });

  it('correctly validates an invalid schema', () => {
    const invalid_schema: EntitySchema = {
      groups: [],
      properties: [
        {
          key: 'user.1',
          type: 'string',
          name: 'Test',
        },
      ],
    };
    expect(() => validateSchema(invalid_schema)).toThrow();
  });

  it('correctly validates readonly properties', () => {
    const prev_props = {
      'meta.id': 'something',
    };
    const props = {
      'meta.id': 'somethingelse',
    };

    const logic = EntityLogic(schema);
    expect(() =>
      logic.validatePropertiesModifiable(prev_props, props),
    ).toThrow();
  });

  /* reenable later
  it('rejects unmodifiable properties altogether, in strict mode', () => {
    const prev_props = {
      'meta.id': 'something',
    };
    const props = {
      'meta.id': 'something',
    };

    const logic = EntityLogic(schema);
    expect(() =>
      logic.validatePropertiesModifiable(prev_props, props, { strict: true }),
    ).toThrow();
  });
  */
  it('correctly validates modifiable single properties (pos)', () => {
    const prev_props = {
      'inventory.3': 'something',
    };
    const props = {
      'inventory.3': 'somethingelse',
    };

    const logic = EntityLogic(schema);
    expect(() =>
      logic.validatePropertiesModifiable(prev_props, props),
    ).not.toThrow();
  });

  it('correctly validates modifiable single properties (neg)', () => {
    const prev_props = {
      'inventory.10': 'test',
    };
    const props = {
      'inventory.10': 'test2',
    };

    const logic = EntityLogic(schema);
    expect(() =>
      logic.validatePropertiesModifiable(prev_props, props),
    ).toThrow();
  });

  it('currently validates modifiable single properties (neg, undefined)', () => {
    const prev_props = {
      'inventory.10': 'test',
    };
    const props = {
      'inventory.10': undefined,
    };

    const logic = EntityLogic(schema);
    expect(() =>
      logic.validatePropertiesModifiable(prev_props, props),
    ).toThrow();
  });

  it('correctly validates modifiable array properties (pos)', () => {
    const prev_props = {
      'inventory.11': ['test', 'test2'],
    };
    const props = {
      'inventory.11': ['test', 'test2'],
    };
    const logic = EntityLogic(schema);
    expect(() =>
      logic.validatePropertiesModifiable(prev_props, props),
    ).not.toThrow();
  });

  it('correctly validates modifiable array properties (neg)', () => {
    const prev_props = {
      'inventory.11': ['test', 'test2'],
    };
    const props = {
      'inventory.11': ['test2', 'test'],
    };
    const logic = EntityLogic(schema);
    expect(() =>
      logic.validatePropertiesModifiable(prev_props, props),
    ).toThrow();
  });
});

describe('isFilterConditionEqual', () => {
  it('correctly compares location filter conditions', () => {
    const logic = EntityLogic(schema);

    const c1: FilterCondition = {
      field: 'meta.location',
      type: 'location',
      operator: 'known',
    };

    const c2: FilterCondition = {
      field: 'meta.location2',
      type: 'location',
      operator: 'known',
    };

    const c3: FilterCondition = {
      field: 'meta.location',
      type: 'string',
      operator: 'known',
    };

    const c4: FilterCondition = {
      field: 'meta.location',
      type: 'location',
      operator: 'unknown',
    };

    expect(logic.isFilterConditionEqual(c1, c1)).toEqual(true);
    expect(logic.isFilterConditionEqual(c1, c2)).toEqual(false);
    expect(logic.isFilterConditionEqual(c1, c3)).toEqual(false);
    expect(logic.isFilterConditionEqual(c1, c4)).toEqual(false);
  });
});
