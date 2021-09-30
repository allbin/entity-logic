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
      propType: 'boolean',
      operator: 'known',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([booleanFalseEntity, booleanTrueEntity]);
  });

  it('correctly executes boolean.unknown conditions', () => {
    const condition: FilterCondition = {
      field: 'boolean.1',
      propType: 'boolean',
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
      propType: 'boolean',
      operator: 'true',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([booleanTrueEntity]);
  });

  it('correctly executes boolean.false conditions', () => {
    const condition: FilterCondition = {
      field: 'boolean.1',
      propType: 'boolean',
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
      propType: 'number',
      operator: 'known',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([numberOneEntity, numberZeroEntity]);
  });

  it('correctly executes number.unknown conditions', () => {
    const condition: FilterCondition = {
      field: 'number.1',
      propType: 'number',
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
      propType: 'number',
      operator: 'eq',
      value: 0,
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([numberZeroEntity]);
  });

  it('correctly executes number.neq conditions', () => {
    const condition: FilterCondition = {
      field: 'number.1',
      propType: 'number',
      operator: 'neq',
      value: 0,
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([numberOneEntity]);
  });

  it('correctly executes number.gt conditions', () => {
    const condition: FilterCondition = {
      field: 'number.1',
      propType: 'number',
      operator: 'gt',
      value: 0,
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([numberOneEntity]);
  });

  it('correctly executes number.gte conditions', () => {
    const condition: FilterCondition = {
      field: 'number.1',
      propType: 'number',
      operator: 'gte',
      value: 0,
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([numberOneEntity, numberZeroEntity]);
  });

  it('correctly executes number.lt conditions', () => {
    const condition: FilterCondition = {
      field: 'number.1',
      propType: 'number',
      operator: 'lt',
      value: 1,
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([numberZeroEntity]);
  });

  it('correctly executes number.lte conditions', () => {
    const condition: FilterCondition = {
      field: 'number.1',
      propType: 'number',
      operator: 'lte',
      value: 1,
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([numberOneEntity, numberZeroEntity]);
  });

  it('correctly executes number.between conditions', () => {
    const condition: FilterCondition = {
      field: 'number.1',
      propType: 'number',
      operator: 'between',
      value: [0, 0],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([numberZeroEntity]);
  });

  it('correctly executes number.not_between conditions', () => {
    const condition: FilterCondition = {
      field: 'number.1',
      propType: 'number',
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
      propType: 'string',
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
      propType: 'string',
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
      propType: 'string',
      operator: 'eq',
      value: 'string',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([stringWithLengthEntity]);
  });

  it('correctly executes string.neq conditions', () => {
    const condition: FilterCondition = {
      field: 'string.1',
      propType: 'string',
      operator: 'neq',
      value: 'string',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([stringWithNoLengthEntity]);
  });

  it('correctly executes string.matches conditions', () => {
    const condition: FilterCondition = {
      field: 'string.1',
      propType: 'string',
      operator: 'matches',
      value: 'r*ng',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([stringWithLengthEntity]);
  });

  it('correctly executes string.not_matches conditions', () => {
    const condition: FilterCondition = {
      field: 'string.1',
      propType: 'string',
      operator: 'not_matches',
      value: 'r*ng',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([stringWithNoLengthEntity]);
  });

  it('correctly executes string.one_of conditions', () => {
    const condition: FilterCondition = {
      field: 'string.1',
      propType: 'string',
      operator: 'one_of',
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
      propType: 'string',
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
      propType: 'enum',
      operator: 'known',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([enumEntity]);
  });

  it('correctly executes enum.unknown conditions', () => {
    const condition: FilterCondition = {
      field: 'enum.1',
      propType: 'enum',
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
      propType: 'enum',
      operator: 'eq',
      value: 'alternative1',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([enumEntity]);
  });

  it('correctly executes enum.neq conditions', () => {
    const condition: FilterCondition = {
      field: 'enum.1',
      propType: 'enum',
      operator: 'neq',
      value: 'alternative2',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([enumEntity]);
  });

  it('correctly executes enum.matches conditions', () => {
    const condition: FilterCondition = {
      field: 'enum.1',
      propType: 'enum',
      operator: 'matches',
      value: 'lter*ive',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([enumEntity]);
  });

  it('correctly executes enum.not_matches conditions', () => {
    const condition: FilterCondition = {
      field: 'enum.1',
      propType: 'enum',
      operator: 'not_matches',
      value: 'r*ng',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([enumEntity]);
  });

  it('correctly executes enum.one_of conditions', () => {
    const condition: FilterCondition = {
      field: 'enum.1',
      propType: 'enum',
      operator: 'one_of',
      value: ['alternative1'],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([enumEntity]);
  });

  it('correctly executes enum.none_of conditions', () => {
    const condition: FilterCondition = {
      field: 'enum.1',
      propType: 'enum',
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
      propType: 'date',
      operator: 'known',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([dateEpochEntity, date5MinAgoEntity]);
  });

  it('correctly executes date.unknown conditions', () => {
    const condition: FilterCondition = {
      field: 'date.1',
      propType: 'date',
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
      propType: 'date',
      operator: 'before',
      value: DateTime.utc().minus({ minutes: 10 }),
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([dateEpochEntity]);
  });

  it('correctly executes date.after conditions', () => {
    const condition: FilterCondition = {
      field: 'date.1',
      propType: 'date',
      operator: 'after',
      value: DateTime.utc().minus({ minutes: 10 }),
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([date5MinAgoEntity]);
  });

  it('correctly executes date.between', () => {
    const condition: FilterCondition = {
      field: 'date.1',
      propType: 'date',
      operator: 'between',
      value: [DateTime.utc().minus({ minutes: 10 }), DateTime.utc()],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([date5MinAgoEntity]);
  });

  it('correctly executes date.not_between', () => {
    const condition: FilterCondition = {
      field: 'date.1',
      propType: 'date',
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
      propType: 'photo',
      operator: 'known',
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([photoEntity]);
  });

  it('correctly executes photo.unknown operators', () => {
    const condition: FilterCondition = {
      field: 'photo.1',
      propType: 'photo',
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
      propType: 'array:number',
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
      propType: 'array:number',
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

  it('correctly executes array:number.includes_none_of conditions', () => {
    const condition: FilterCondition = {
      field: 'array-number.1',
      propType: 'array:number',
      operator: 'includes_none_of',
      value: [3, 7],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([arrayEvenNumbersEntity]);
  });

  it('correctly executes array:number.includes_any_of conditions', () => {
    const condition: FilterCondition = {
      field: 'array-number.1',
      propType: 'array:number',
      operator: 'includes_any_of',
      value: [2, 10],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([arrayEvenNumbersEntity]);
  });

  it('correctly executes array:number.includes_all_of conditions', () => {
    const condition: FilterCondition = {
      field: 'array-number.1',
      propType: 'array:number',
      operator: 'includes_all_of',
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
      propType: 'array:string',
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
      propType: 'array:string',
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

  it('correctly executes array:string.includes_none_of conditions', () => {
    const condition: FilterCondition = {
      field: 'array-string.1',
      propType: 'array:string',
      operator: 'includes_none_of',
      value: ['string1'],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([arrayStringEntitySecond]);
  });

  it('correctly executes array:string.includes_any_of conditions', () => {
    const condition: FilterCondition = {
      field: 'array-string.1',
      propType: 'array:string',
      operator: 'includes_any_of',
      value: ['string1'],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([arrayStringEntityFirst]);
  });

  it('correctly executes array:string.includes_all_of conditions', () => {
    const condition: FilterCondition = {
      field: 'array-string.1',
      propType: 'array:string',
      operator: 'includes_all_of',
      value: ['string5', 'string6'],
    };

    const result = entityLogic.execute(entities, [condition]);
    expect(result).toMatchObject([arrayStringEntitySecond]);
  });
});
