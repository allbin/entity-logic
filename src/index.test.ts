import { Entity, EntityLogic, EntitySchema, FilterCondition } from './index';

import { DateTime } from 'luxon';

const schema: EntitySchema = {
  groups: [],
  properties: [
    {
      key: 'boolean.1',
      type: 'boolean',
      name: 'Boolean',
    },
    {
      key: 'number.1',
      type: 'number',
      name: 'Number',
    },
    {
      key: 'string.1',
      type: 'string',
      name: 'String',
    },
    {
      key: 'date.1',
      type: 'date',
      name: 'Date',
    },
    {
      key: 'date.2',
      type: 'date',
      name: 'DateString',
    },
    {
      key: 'enum.1',
      type: 'enum',
      name: 'Enum',
      alternatives: ['alternative1', 'alternative2'],
    },
    {
      key: 'photo.1',
      type: 'photo',
      name: 'Photo',
    },
    {
      key: 'array-number.1',
      type: 'array:number',
      name: 'ArrayNumber',
    },
    {
      key: 'array-string.1',
      type: 'array:string',
      name: 'ArrayString',
    },
  ],
  translations: {},
};

const undefinedEntity = {
  properties: {
    'meta.id': 'undefined',
  },
};
const booleanTrueEntity = {
  properties: {
    'meta.id': 'boolean_id_true',
    'boolean.1': true,
  },
};
const booleanFalseEntity = {
  properties: {
    'meta.id': 'boolean_id_false',
    'boolean.1': false,
  },
};

const numberOneEntity = {
  properties: {
    'meta.id': 'number_id_1',
    'number.1': 1,
  },
};
const numberZeroEntity = {
  properties: {
    'meta.id': 'number_id_0',
    'number.1': 0,
  },
};
const stringWithLengthEntity = {
  properties: {
    'meta.id': 'string_id_len',
    'string.1': 'string',
  },
};

const stringWithNoLengthEntity = {
  properties: {
    'meta.id': 'string_id_nolen',
    'string.1': '',
  },
};
const dateEpochEntity = {
  properties: {
    'meta.id': 'date_epoch_utc',
    'date.1': DateTime.utc(1970, 1, 1, 0, 0, 0, 0),
  },
};
const date5MinAgoEntity = {
  properties: {
    'meta.id': 'date_5_min_ago',
    'date.1': DateTime.utc().minus({ minutes: 5 }),
  },
};

const enumEntity = {
  properties: {
    'meta.id': 'enum_id',
    'enum.1': 'alternative1',
  },
};

const photoEntity = {
  properties: {
    'meta.id': 'photo_id',
    'photo.1': 'https://photo-url',
  },
};

const arrayEvenNumbersEntity = {
  properties: {
    'meta.id': 'array_number_id',
    'array-number.1': [0, 2, 4],
  },
};

const arrayOddNumbersEntity = {
  properties: {
    'meta.id': 'array_number_id',
    'array-number.1': [1, 3, 5],
  },
};

const arrayStringEntityFirst = {
  properties: {
    'meta.id': 'array_string_id',
    'array-string.1': ['string1', 'string2', 'string3'],
  },
};

const arrayStringEntitySecond = {
  properties: {
    'meta.id': 'array_string_id',
    'array-string.1': ['string4', 'string5', 'string6'],
  },
};

const entities: Entity[] = [
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
];

const entityLogic = EntityLogic(schema);

describe('boolean operators', () => {
  it('correctly executes boolean.known conditions', () => {
    const condition: FilterCondition = {
      field: 'boolean.1',
      type: 'boolean',
      operator: 'known',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([booleanFalseEntity, booleanTrueEntity]);
  });

  it('correctly executes boolean.unknown conditions', () => {
    const condition: FilterCondition = {
      field: 'boolean.1',
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
    ]);
  });

  it('correctly executes boolean.true conditions', () => {
    const condition: FilterCondition = {
      field: 'boolean.1',
      type: 'boolean',
      operator: 'true',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([booleanTrueEntity]);
  });

  it('correctly executes boolean.false conditions', () => {
    const condition: FilterCondition = {
      field: 'boolean.1',
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
      field: 'number.1',
      type: 'number',
      operator: 'known',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([numberOneEntity, numberZeroEntity]);
  });

  it('correctly executes number.unknown conditions', () => {
    const condition: FilterCondition = {
      field: 'number.1',
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
    ]);
  });

  it('correctly executes number.eq conditions', () => {
    const condition: FilterCondition = {
      field: 'number.1',
      type: 'number',
      operator: 'eq',
      value: 0,
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([numberZeroEntity]);
  });

  it('correctly executes number.neq conditions', () => {
    const condition: FilterCondition = {
      field: 'number.1',
      type: 'number',
      operator: 'neq',
      value: 0,
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([numberOneEntity]);
  });

  it('correctly executes number.gt conditions', () => {
    const condition: FilterCondition = {
      field: 'number.1',
      type: 'number',
      operator: 'gt',
      value: 0,
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([numberOneEntity]);
  });

  it('correctly executes number.gte conditions', () => {
    const condition: FilterCondition = {
      field: 'number.1',
      type: 'number',
      operator: 'gte',
      value: 0,
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([numberOneEntity, numberZeroEntity]);
  });

  it('correctly executes number.lt conditions', () => {
    const condition: FilterCondition = {
      field: 'number.1',
      type: 'number',
      operator: 'lt',
      value: 1,
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([numberZeroEntity]);
  });

  it('correctly executes number.lte conditions', () => {
    const condition: FilterCondition = {
      field: 'number.1',
      type: 'number',
      operator: 'lte',
      value: 1,
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([numberOneEntity, numberZeroEntity]);
  });

  it('correctly executes number.between conditions', () => {
    const condition: FilterCondition = {
      field: 'number.1',
      type: 'number',
      operator: 'between',
      value: [0, 0],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([numberZeroEntity]);
  });

  it('correctly executes number.not_between conditions', () => {
    const condition: FilterCondition = {
      field: 'number.1',
      type: 'number',
      operator: 'not_between',
      value: [0, 0],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([numberOneEntity]);
  });
});

describe('string operators', () => {
  it('correctly executes string.known conditions', () => {
    const condition: FilterCondition = {
      field: 'string.1',
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
      field: 'string.1',
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
    ]);
  });

  it('correctly executes string.eq conditions', () => {
    const condition: FilterCondition = {
      field: 'string.1',
      type: 'string',
      operator: 'eq',
      value: 'string',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([stringWithLengthEntity]);
  });

  it('correctly executes string.neq conditions', () => {
    const condition: FilterCondition = {
      field: 'string.1',
      type: 'string',
      operator: 'neq',
      value: 'string',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([stringWithNoLengthEntity]);
  });

  it('correctly executes string.matches conditions', () => {
    const condition: FilterCondition = {
      field: 'string.1',
      type: 'string',
      operator: 'matches',
      value: 'r*ng',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([stringWithLengthEntity]);
  });

  it('correctly executes string.not_matches conditions', () => {
    const condition: FilterCondition = {
      field: 'string.1',
      type: 'string',
      operator: 'not_matches',
      value: 'r*ng',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([stringWithNoLengthEntity]);
  });

  it('correctly executes string.any_of conditions', () => {
    const condition: FilterCondition = {
      field: 'string.1',
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

  it('correctly executes string.none_of conditions', () => {
    const condition: FilterCondition = {
      field: 'string.1',
      type: 'string',
      operator: 'none_of',
      value: ['string'],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([stringWithNoLengthEntity]);
  });
});

describe('enum operators', () => {
  it('correctly executes enum.known conditions', () => {
    const condition: FilterCondition = {
      field: 'enum.1',
      type: 'enum',
      operator: 'known',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([enumEntity]);
  });

  it('correctly executes enum.unknown conditions', () => {
    const condition: FilterCondition = {
      field: 'enum.1',
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
    ]);
  });

  it('correctly executes enum.eq conditions', () => {
    const condition: FilterCondition = {
      field: 'enum.1',
      type: 'enum',
      operator: 'eq',
      value: 'alternative1',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([enumEntity]);
  });

  it('correctly executes enum.neq conditions', () => {
    const condition: FilterCondition = {
      field: 'enum.1',
      type: 'enum',
      operator: 'neq',
      value: 'alternative2',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([enumEntity]);
  });

  it('correctly executes enum.matches conditions', () => {
    const condition: FilterCondition = {
      field: 'enum.1',
      type: 'enum',
      operator: 'matches',
      value: 'lter*ive',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([enumEntity]);
  });

  it('correctly executes enum.not_matches conditions', () => {
    const condition: FilterCondition = {
      field: 'enum.1',
      type: 'enum',
      operator: 'not_matches',
      value: 'r*ng',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([enumEntity]);
  });

  it('correctly executes enum.any_of conditions', () => {
    const condition: FilterCondition = {
      field: 'enum.1',
      type: 'enum',
      operator: 'any_of',
      value: ['alternative1'],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([enumEntity]);
  });

  it('correctly executes enum.none_of conditions', () => {
    const condition: FilterCondition = {
      field: 'enum.1',
      type: 'enum',
      operator: 'none_of',
      value: ['alternative2'],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([enumEntity]);
  });
});

describe('date operators', () => {
  it('correctly executes date.known conditions', () => {
    const condition: FilterCondition = {
      field: 'date.1',
      type: 'date',
      operator: 'known',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([dateEpochEntity, date5MinAgoEntity]);
  });

  it('correctly executes date.unknown conditions', () => {
    const condition: FilterCondition = {
      field: 'date.1',
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
    ]);
  });

  it('correctly executes date.before conditions', () => {
    const condition: FilterCondition = {
      field: 'date.1',
      type: 'date',
      operator: 'before',
      value: DateTime.utc().minus({ minutes: 10 }),
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([dateEpochEntity]);
  });

  it('correctly executes date.after conditions', () => {
    const condition: FilterCondition = {
      field: 'date.1',
      type: 'date',
      operator: 'after',
      value: DateTime.utc().minus({ minutes: 10 }),
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([date5MinAgoEntity]);
  });

  it('correctly executes date.between', () => {
    const condition: FilterCondition = {
      field: 'date.1',
      type: 'date',
      operator: 'between',
      value: [DateTime.utc().minus({ minutes: 10 }), DateTime.utc()],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([date5MinAgoEntity]);
  });

  it('correctly executes date.not_between', () => {
    const condition: FilterCondition = {
      field: 'date.1',
      type: 'date',
      operator: 'not_between',
      value: [DateTime.utc().minus({ minutes: 10 }), DateTime.utc()],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([dateEpochEntity]);
  });
});

describe('photo operators', () => {
  it('correctly executes photo.known operators', () => {
    const condition: FilterCondition = {
      field: 'photo.1',
      type: 'photo',
      operator: 'known',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([photoEntity]);
  });

  it('correctly executes photo.unknown operators', () => {
    const condition: FilterCondition = {
      field: 'photo.1',
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
    ]);
  });
});

describe('array:number operators', () => {
  it('correctly executes array:number.known conditions', () => {
    const condition: FilterCondition = {
      field: 'array-number.1',
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
      field: 'array-number.1',
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
    ]);
  });

  it('correctly executes array:number.none_of conditions', () => {
    const condition: FilterCondition = {
      field: 'array-number.1',
      type: 'array:number',
      operator: 'none_of',
      value: [3, 7],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([arrayEvenNumbersEntity]);
  });

  it('correctly executes array:number.any_of conditions', () => {
    const condition: FilterCondition = {
      field: 'array-number.1',
      type: 'array:number',
      operator: 'any_of',
      value: [2, 10],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([arrayEvenNumbersEntity]);
  });

  it('correctly executes array:number.all_of conditions', () => {
    const condition: FilterCondition = {
      field: 'array-number.1',
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
      field: 'array-string.1',
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
      field: 'array-string.1',
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
    ]);
  });

  it('correctly executes array:string.none_of conditions', () => {
    const condition: FilterCondition = {
      field: 'array-string.1',
      type: 'array:string',
      operator: 'none_of',
      value: ['string1'],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([arrayStringEntitySecond]);
  });

  it('correctly executes array:string.any_of conditions', () => {
    const condition: FilterCondition = {
      field: 'array-string.1',
      type: 'array:string',
      operator: 'any_of',
      value: ['string1'],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([arrayStringEntityFirst]);
  });

  it('correctly executes array:string.all_of conditions', () => {
    const condition: FilterCondition = {
      field: 'array-string.1',
      type: 'array:string',
      operator: 'all_of',
      value: ['string5', 'string6'],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([arrayStringEntitySecond]);
  });
});

describe('validation', () => {
  it('correctly validates a valid filter condition', () => {
    const logic = EntityLogic(schema);

    const condition: FilterCondition = {
      field: 'enum.1',
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
      field: 'enum.1',
      type: 'string',
      operator: 'any_of',
      value: ['alternative1'],
    };

    expect(() => logic.validateFilter([condition])).toThrow();
  });

  it('correctly validates a set of valid properties', () => {
    const props = {
      'enum.1': 'alternative2',
      'boolean.1': true,
      'number.1': 0,
      'string.1': 'string',
      'photo.1': 'https://example.com',
      'array-number.1': [0, 1, 2],
      'array-string.1': ['a', 'b', 'c'],
      'date.1': new Date(),
      'date.2': new Date().toISOString(),
    };

    const logic = EntityLogic(schema);
    expect(() => logic.validateProperties(props)).not.toThrow();
  });

  it('correctly validates an invalid boolean property', () => {
    const props = {
      'boolean.1': 'string',
    };

    const logic = EntityLogic(schema);
    expect(() => logic.validateProperties(props)).toThrow();
  });

  it('correctly validates an invalid number property', () => {
    const props = {
      'number.1': 'string',
    };

    const logic = EntityLogic(schema);
    expect(() => logic.validateProperties(props)).toThrow();
  });

  it('correctly validates an invalid string property', () => {
    const props = {
      'string.1': 2,
    };

    const logic = EntityLogic(schema);
    expect(() => logic.validateProperties(props)).toThrow();
  });

  it('correctly validates an invalid date property', () => {
    const props = {
      'date.1': 'string',
    };

    const logic = EntityLogic(schema);
    expect(() => logic.validateProperties(props)).toThrow();
  });

  it('correctly validates an invalid photo property', () => {
    const props = {
      'photo.1': 3,
    };

    const logic = EntityLogic(schema);
    expect(() => logic.validateProperties(props)).toThrow();
  });
  it('correctly validates an invalid array:number property', () => {
    const props = {
      'array-number.1': ['a'],
    };

    const logic = EntityLogic(schema);
    expect(() => logic.validateProperties(props)).toThrow();
  });
  it('correctly validates an invalid array:string property', () => {
    const props = {
      'array-string.1': [2],
    };

    const logic = EntityLogic(schema);
    expect(() => logic.validateProperties(props)).toThrow();
  });
});
