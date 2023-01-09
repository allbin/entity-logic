import { Entity, EntitySchema } from './types/schema';
import { DateTime } from 'luxon';
import { EntityLogic } from './index';

export const schema: EntitySchema = {
  groups: [],
  properties: [
    {
      key: 'meta.id',
      type: 'string',
      name: 'ID',
    },
    {
      key: 'meta.location',
      type: 'location',
      name: 'Koordinat',
      modifiable: true,
    },
    {
      key: 'inventory.1',
      type: 'boolean',
      name: 'boolean',
      modifiable: true,
    },
    {
      key: 'inventory.2',
      type: 'number',
      name: 'number',
      modifiable: true,
    },
    {
      key: 'inventory.3',
      type: 'string',
      name: 'string',
      modifiable: true,
    },
    {
      key: 'inventory.4',
      type: 'date',
      name: 'date',
      modifiable: true,
    },
    {
      key: 'inventory.5',
      type: 'date',
      name: 'datestring',
      modifiable: true,
    },
    {
      key: 'inventory.6',
      type: 'enum',
      name: 'enum',
      alternatives: ['alternative1', 'alternative2'],
      modifiable: true,
    },
    {
      key: 'inventory.7',
      type: 'photo',
      name: 'photo',
      modifiable: true,
    },
    {
      key: 'inventory.8',
      type: 'array:number',
      name: 'arraynumber',
      modifiable: true,
    },
    {
      key: 'inventory.9',
      type: 'array:string',
      name: 'arraystring',
      modifiable: true,
    },
    {
      key: 'inventory.10',
      type: 'string',
      name: 'string-readonly',
    },
    {
      key: 'inventory.11',
      type: 'array:string',
      name: 'arraystring-readonly',
    },
  ],
};

export const undefinedEntity = {
  properties: {
    'meta.id': 'undefined',
  },
};
export const booleanTrueEntity = {
  properties: {
    'meta.id': 'boolean_id_true',
    'inventory.1': true,
  },
};
export const booleanFalseEntity = {
  properties: {
    'meta.id': 'boolean_id_false',
    'inventory.1': false,
  },
};

export const numberOneEntity = {
  properties: {
    'meta.id': 'number_id_1',
    'inventory.2': 1,
  },
};
export const numberZeroEntity = {
  properties: {
    'meta.id': 'number_id_0',
    'inventory.2': 0,
  },
};
export const stringWithLengthEntity = {
  properties: {
    'meta.id': 'string_id_len',
    'inventory.3': 'string',
  },
};

export const stringWithNoLengthEntity = {
  properties: {
    'meta.id': 'string_id_nolen',
    'inventory.3': '',
  },
};
export const dateEpochEntity = {
  properties: {
    'meta.id': 'date_epoch_utc',
    'inventory.4': DateTime.utc(1970, 1, 1, 0, 0, 0, 0),
  },
};
export const date5MinAgoEntity = {
  properties: {
    'meta.id': 'date_5_min_ago',
    'inventory.4': DateTime.utc().minus({ minutes: 5 }),
  },
};

export const enumEntity = {
  properties: {
    'meta.id': 'enum_id',
    'inventory.6': 'alternative1',
  },
};

export const photoEntity = {
  properties: {
    'meta.id': 'photo_id',
    'inventory.7': 'https://photo-url',
  },
};

export const arrayEvenNumbersEntity = {
  properties: {
    'meta.id': 'array_number_id',
    'inventory.8': [0, 2, 4],
  },
};

export const arrayOddNumbersEntity = {
  properties: {
    'meta.id': 'array_number_id',
    'inventory.8': [1, 3, 5],
  },
};

export const arrayStringEntityFirst = {
  properties: {
    'meta.id': 'array_string_id',
    'inventory.9': ['string1', 'string2', 'string3'],
  },
};

export const arrayStringEntitySecond = {
  properties: {
    'meta.id': 'array_string_id',
    'inventory.9': ['string4', 'string5', 'string6'],
  },
};

export const locationEntity = {
  properties: {
    'meta.id': 'location_id',
    'meta.location': [15.6, 56.2],
  },
};

export const entities: Entity[] = [
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
];

export const entityLogic = EntityLogic(schema);
