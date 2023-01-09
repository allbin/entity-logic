import { entityLogic, stringWithLengthEntity } from './testdata';

describe('should match', () => {
  it('single string', () => {
    expect(
      entityLogic.matches(stringWithLengthEntity, [
        {
          field: 'inventory.3',
          type: 'string',
          operator: 'eq',
          value: 'string',
        },
      ]),
    ).toBe(true);
  });

  it('multiple conditions', () => {
    expect(
      entityLogic.matches(stringWithLengthEntity, [
        {
          field: 'inventory.3',
          type: 'string',
          operator: 'eq',
          value: 'string',
        },
        {
          field: 'inventory.3',
          type: 'string',
          operator: 'known',
        },
      ]),
    ).toBe(true);
  });
});

describe('should not match', () => {
  it('single string', () => {
    expect(
      entityLogic.matches(stringWithLengthEntity, [
        {
          field: 'inventory.3',
          type: 'string',
          operator: 'eq',
          value: 'strings',
        },
      ]),
    ).toBe(false);
  });
  it('multiple conditions', () => {
    expect(
      entityLogic.matches(stringWithLengthEntity, [
        {
          field: 'inventory.3',
          type: 'string',
          operator: 'eq',
          value: 'strings',
        },
        {
          field: 'inventory.3',
          type: 'string',
          operator: 'neq',
          value: 'strings',
        },
      ]),
    ).toBe(false);
  });
});
