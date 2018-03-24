import { MinuteScope, SelectionScope } from '../../src/scope';

describe('MinuteScope', () => {
  const date = new Date(2018, 3, 24, 15, 59, 0, 0);
  let scope: MinuteScope;

  beforeEach(() => {
    scope = new MinuteScope();
  });

  it('next should move to next hour', () => {
    const result = scope.next(date);

    expect(result.getHours()).toBe(date.getHours() + 1);
  });

  it('previous should move to previous hour', () => {
    const result = scope.previous(date);

    expect(result.getHours()).toBe(date.getHours() - 1);
  });

  it('getItems should return expected items', () => {
    const result = scope.getItems(date);

    expect(result.length).toBe(12);

    expect(result.map(item => item.getMinutes())).toEqual([ 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55 ]);
  });

  it('formatDate should use correct format', () => {
    const result = scope.formatDate(date);
    expect(result).toBe('59');
  });

  it('title should return year', () => {
    const result = scope.title(date);
    expect(result).toBe('24. 04. 2018');
  });

  it('isEqual should compare only minute parts when there is no previous scope', () => {
    let a = new Date(2018, 3, 24, 15, 0, 0, 0);
    let b = new Date(2018, 3, 24, 15, 0, 0, 0);

    expect(scope.isEqual(a, b)).toBe(true);

    a = new Date(2018, 3, 24, 15, 10, 0, 0);
    b = new Date(2018, 3, 24, 15, 0, 0, 0);

    expect(scope.isEqual(a, b)).toBe(false);

    a = new Date(2018, 3, 24, 15, 0, 0, 0);
    b = new Date(2018, 3, 24, 15, 10, 0, 0);

    expect(scope.isEqual(a, b)).toBe(false);

    /** This tests if only minutes are compared or not */
    a = new Date(2019, 2, 23, 16, 10, 0, 0);
    b = new Date(2018, 3, 24, 15, 10, 0, 0);

    expect(scope.isEqual(a, b)).toBe(true);
  });

  it('isEqual should use also previous scopes in comparison', () => {
    const previousScope: Partial<SelectionScope> = {
      isEqual: (first: Date, second: Date) => false
    };

    scope.setPreviousScope(previousScope as SelectionScope);

    let a = new Date(2018, 3, 24, 0, 0, 0, 0);
    let b = new Date(2018, 3, 24, 0, 0, 0, 0);

    expect(scope.isEqual(a, b)).toBe(false);
  });
});
