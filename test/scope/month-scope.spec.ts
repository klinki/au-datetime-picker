import { MonthScope, SelectionScope } from '../../src/scope';

describe('MonthScope', () => {
  const date = new Date(2018, 3, 24, 15, 0, 0, 0);
  let scope: MonthScope;

  beforeEach(() => {
    scope = new MonthScope();
  });

  it('next should move to next year', () => {
    const result = scope.next(date);

    expect(result.getFullYear()).toBe(date.getFullYear() + 1);
  });

  it('previous should move to previous year', () => {
    const result = scope.previous(date);

    expect(result.getFullYear()).toBe(date.getFullYear() - 1);
  });

  it('getItems should return expected items', () => {
    const result = scope.getItems(date);

    expect(result.length).toBe(12);

    expect(result.map(item => item.getMonth())).toEqual(
      [ 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1 ]
    );
  });

  it('formatDate should use correct format', () => {
    const result = scope.formatDate(date);
    expect(result).toBe('Apr');
  });

  it('formatDate should respect locale', () => {
    const locale = undefined;
    const result = scope.formatDate(date, locale);
    expect(result).toBe('Apr');
  });


  it('title should return year', () => {
    const result = scope.title(date);
    expect(result).toBe('2018');
  });

  it('isEqual should compare only month parts when there is no previous scope', () => {
    let a = new Date(2018, 3, 1, 0, 0, 0, 0);
    let b = new Date(2018, 3, 24, 15, 0, 0, 0);

    expect(scope.isEqual(a, b)).toBe(true);

    a = new Date(2018, 3, 24, 0, 0, 0, 0);
    b = new Date(2017, 4, 24, 0, 0, 0, 0);

    expect(scope.isEqual(a, b)).toBe(false);

    a = new Date(2018, 4, 24, 0, 0, 0, 0);
    b = new Date(2019, 3, 24, 0, 0, 0, 0);

    expect(scope.isEqual(a, b)).toBe(false);

    /** This tests if only months are compared or not */
    a = new Date(2019, 12, 25, 0, 0, 0, 0);
    b = new Date(2018, 12, 31, 23, 59, 59, 0);

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
