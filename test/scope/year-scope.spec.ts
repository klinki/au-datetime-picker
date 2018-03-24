import { YearScope, SelectionScope } from '../../src/scope';

describe('YearScope', () => {
  const date = new Date(2018, 3, 24, 15, 0, 0, 0);
  let scope: YearScope;

  beforeEach(() => {
    scope = new YearScope();
  });

  it('next should move to next decade', () => {
    const result = scope.next(date);

    expect(result.getFullYear()).toBe(date.getFullYear() + 10);
  });

  it('previous should move to previous decade', () => {
    const result = scope.previous(date);

    expect(result.getFullYear()).toBe(date.getFullYear() - 10);
  });

  it('getItems should return expected items', () => {
    const result = scope.getItems(date);

    expect(result.length).toBe(12);
  });

  it('formatDate should use correct format', () => {
    const result = scope.formatDate(date);
    expect(result).toBe('2018');
  });

  it('title should return expected result', () => {
    const result = scope.title(date);
    expect(result).toBe('2018 - 2029');
  });

  it('isEqual should compare only year parts when there is no previous scope', () => {
    let a = new Date(2018, 3, 24, 0, 0, 0, 0);
    let b = new Date(2018, 3, 24, 15, 0, 0, 0);

    expect(scope.isEqual(a, b)).toBe(true);

    a = new Date(2018, 3, 24, 0, 0, 0, 0);
    b = new Date(2017, 3, 25, 0, 0, 0, 0);

    expect(scope.isEqual(a, b)).toBe(false);

    a = new Date(2018, 3, 23, 0, 0, 0, 0);
    b = new Date(2019, 3, 24, 0, 0, 0, 0);

    expect(scope.isEqual(a, b)).toBe(false);

    /** This tests if only years are compared or not */
    a = new Date(2018, 1, 1, 0, 0, 0, 0);
    b = new Date(2018, 10, 10, 23, 59, 59, 0);

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
