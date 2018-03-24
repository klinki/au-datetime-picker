import { HourScope, SelectionScope } from '../../src/scope';

describe('HourScope', () => {
  const date = new Date(2018, 3, 24, 15, 0, 0, 0);
  let scope: HourScope;

  beforeEach(() => {
    scope = new HourScope();
  });

  it('next should move to next day', () => {
    const result = scope.next(date);

    expect(result.getDate()).toBe(date.getDate() + 1);
  });

  it('previous should move to previous day', () => {
    const result = scope.previous(date);

    expect(result.getDate()).toBe(date.getDate() - 1);
  });

  it('getItems should return expected items', () => {
    const result = scope.getItems(date);

    expect(result.length).toBe(12);
  });

  it('formatDate should use correct format', () => {
    const result = scope.formatDate(date);
    expect(result).toBe('15');
  });

  it('title should return expected result', () => {
    const result = scope.title(date);
    expect(result).toBe('24. 04. 2018');
  });

  it('isEqual should compare only hour parts when there is no previous scope', () => {
    let a = new Date(2018, 3, 24, 15, 0, 0, 0);
    let b = new Date(2018, 3, 24, 15, 0, 0, 0);

    expect(scope.isEqual(a, b)).toBe(true);

    a = new Date(2018, 3, 24, 16, 0, 0, 0);
    b = new Date(2018, 3, 24, 15, 0, 0, 0);

    expect(scope.isEqual(a, b)).toBe(false);

    a = new Date(2018, 3, 24, 15, 0, 0, 0);
    b = new Date(2018, 3, 24, 16, 0, 0, 0);

    expect(scope.isEqual(a, b)).toBe(false);

    /** This tests if only hours are compared or not */
    a = new Date(2019, 2, 23, 15, 0, 0, 0);
    b = new Date(2018, 3, 24, 15, 0, 0, 0);

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
